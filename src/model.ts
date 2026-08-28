import type { BoardState, Concept, KnowledgeStatus } from './types';

export const statusLabel: Record<KnowledgeStatus, string> = {
  not_yet: 'Not yet',
  explain: 'Can explain',
  solve: 'Can solve'
};

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ancestors(state: BoardState, goalId: string): Set<string> {
  const found = new Set<string>([goalId]);
  const visit = (id: string): void => {
    state.edges.filter((item) => item.dependentId === id).forEach((item) => {
      if (!found.has(item.prerequisiteId)) {
        found.add(item.prerequisiteId);
        visit(item.prerequisiteId);
      }
    });
  };
  visit(goalId);
  return found;
}

export function depthFromGoal(state: BoardState, goalId: string): Map<string, number> {
  const depths = new Map<string, number>([[goalId, 0]]);
  const queue = [goalId];
  while (queue.length) {
    const current = queue.shift()!;
    const depth = depths.get(current) ?? 0;
    state.edges.filter((item) => item.dependentId === current).forEach((item) => {
      // An acyclic path cannot be longer than the number of concepts. The
      // bound preserves longest-path recommendation ordering while keeping a
      // damaged legacy record from trapping the renderer in a loop.
      if (depth < state.concepts.length && (!depths.has(item.prerequisiteId) || (depths.get(item.prerequisiteId) ?? 0) < depth + 1)) {
        depths.set(item.prerequisiteId, depth + 1);
        queue.push(item.prerequisiteId);
      }
    });
  }
  return depths;
}

export function recommendation(state: BoardState, goalId: string | null): Concept | null {
  if (!goalId) return null;
  const relevant = ancestors(state, goalId);
  const depths = depthFromGoal(state, goalId);
  const candidates = state.concepts.filter((concept) => {
    if (!relevant.has(concept.id) || concept.status !== 'not_yet') return false;
    const prerequisites = state.edges
      .filter((item) => item.dependentId === concept.id)
      .map((item) => state.concepts.find((candidate) => candidate.id === item.prerequisiteId));
    return prerequisites.every((item) => item && item.status !== 'not_yet');
  });
  candidates.sort((a, b) => (depths.get(b.id) ?? 0) - (depths.get(a.id) ?? 0) || a.createdAt.localeCompare(b.createdAt));
  return candidates[0] ?? null;
}

export function wouldCreateCycle(state: BoardState, prerequisiteId: string, dependentId: string): boolean {
  if (prerequisiteId === dependentId) return true;
  return ancestors(state, prerequisiteId).has(dependentId);
}

export function validateBoard(value: unknown): BoardState {
  if (!value || typeof value !== 'object') throw new Error('The file does not contain a pathboard.');
  const board = value as Partial<BoardState>;
  if (board.version !== 1 || !Array.isArray(board.concepts) || !Array.isArray(board.edges)) {
    throw new Error('This pathboard format is not supported.');
  }
  const isStatus = (status: unknown): status is KnowledgeStatus => typeof status === 'string' && ['not_yet', 'explain', 'solve'].includes(status);
  const isDate = (date: unknown): date is string => typeof date === 'string' && !Number.isNaN(Date.parse(date));
  const ids = new Set<string>();
  const concepts: Concept[] = [];
  for (const item of board.concepts) {
    if (!item || typeof item.id !== 'string' || !item.id || typeof item.title !== 'string' || !item.title.trim() || item.title.length > 90 || !['goal', 'concept'].includes(item.kind) || !isStatus(item.status) || typeof item.notes !== 'string' || item.notes.length > 400 || !isDate(item.createdAt) || !isDate(item.updatedAt)) {
      throw new Error('One concept is missing a title, type, or status.');
    }
    if (ids.has(item.id)) throw new Error('Two concepts use the same identifier.');
    ids.add(item.id);
    concepts.push({ id: item.id, title: item.title.trim(), notes: item.notes, kind: item.kind, status: item.status, createdAt: item.createdAt, updatedAt: item.updatedAt });
  }
  const edgeIds = new Set<string>();
  const edges = [] as BoardState['edges'];
  const pairs = new Set<string>();
  for (const item of board.edges) {
    if (!item || typeof item.id !== 'string' || !item.id || !ids.has(item.prerequisiteId) || !ids.has(item.dependentId) || item.prerequisiteId === item.dependentId) {
      throw new Error('One prerequisite points to a missing concept.');
    }
    const pair = `${item.prerequisiteId}\u0000${item.dependentId}`;
    if (edgeIds.has(item.id) || pairs.has(pair)) throw new Error('A prerequisite is duplicated.');
    edgeIds.add(item.id);
    pairs.add(pair);
    edges.push({ id: item.id, prerequisiteId: item.prerequisiteId, dependentId: item.dependentId });
  }
  const prerequisites = new Map<string, string[]>();
  for (const edge of edges) prerequisites.set(edge.dependentId, [...(prerequisites.get(edge.dependentId) ?? []), edge.prerequisiteId]);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): void => {
    if (visiting.has(id)) throw new Error('This import contains a prerequisite loop. Remove the loop and try again.');
    if (visited.has(id)) return;
    visiting.add(id);
    for (const prerequisiteId of prerequisites.get(id) ?? []) visit(prerequisiteId);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of ids) visit(id);
  const repairs = [] as BoardState['repairs'];
  const repairIds = new Set<string>();
  for (const item of board.repairs ?? []) {
    if (!item || typeof item.id !== 'string' || !item.id || repairIds.has(item.id) || !ids.has(item.conceptId) || typeof item.conceptTitle !== 'string' || !item.conceptTitle.trim() || item.conceptTitle.length > 90 || !isStatus(item.status) || !isDate(item.at)) {
      throw new Error('One repair entry is incomplete. Remove it and try again.');
    }
    repairIds.add(item.id);
    repairs.push({ id: item.id, conceptId: item.conceptId, conceptTitle: item.conceptTitle.trim(), status: item.status, at: item.at });
  }
  const goals = concepts.filter((item) => item.kind === 'goal');
  return {
    version: 1,
    name: typeof board.name === 'string' ? board.name.slice(0, 120) : 'Imported pathboard',
    concepts,
    edges,
    activeGoalId: typeof board.activeGoalId === 'string' && goals.some((item) => item.id === board.activeGoalId) ? board.activeGoalId : goals[0]?.id ?? null,
    repairs,
    updatedAt: new Date().toISOString()
  };
}

export function toMarkdown(state: BoardState): string {
  const lines = [`# ${state.name}`, '', `Exported ${new Date().toISOString().slice(0, 10)}`, ''];
  const goals = state.concepts.filter((item) => item.kind === 'goal');
  for (const goal of goals) {
    lines.push(`## Goal: ${goal.title}`, '', `Status: ${statusLabel[goal.status]}`, '');
    const relevant = ancestors(state, goal.id);
    const depths = depthFromGoal(state, goal.id);
    state.concepts
      .filter((item) => relevant.has(item.id) && item.id !== goal.id)
      .sort((a, b) => (depths.get(a.id) ?? 0) - (depths.get(b.id) ?? 0))
      .forEach((item) => {
        const dependsOn = state.edges.filter((edge) => edge.dependentId === item.id).map((edge) => state.concepts.find((candidate) => candidate.id === edge.prerequisiteId)?.title).filter(Boolean);
        lines.push(`- [${item.status === 'not_yet' ? ' ' : 'x'}] **${item.title}** — ${statusLabel[item.status]}${dependsOn.length ? `; needs ${dependsOn.join(', ')}` : ''}`);
      });
    lines.push('');
  }
  return lines.join('\n');
}
