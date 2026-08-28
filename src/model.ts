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
      if (!depths.has(item.prerequisiteId) || (depths.get(item.prerequisiteId) ?? 0) < depth + 1) {
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
  const ids = new Set<string>();
  for (const item of board.concepts) {
    if (!item || typeof item.id !== 'string' || typeof item.title !== 'string' || !['goal', 'concept'].includes(item.kind) || !['not_yet', 'explain', 'solve'].includes(item.status)) {
      throw new Error('One concept is missing a title, type, or status.');
    }
    if (ids.has(item.id)) throw new Error('Two concepts use the same identifier.');
    ids.add(item.id);
  }
  for (const item of board.edges) {
    if (!item || !ids.has(item.prerequisiteId) || !ids.has(item.dependentId)) {
      throw new Error('One prerequisite points to a missing concept.');
    }
  }
  return {
    version: 1,
    name: typeof board.name === 'string' ? board.name.slice(0, 120) : 'Imported pathboard',
    concepts: board.concepts,
    edges: board.edges,
    activeGoalId: typeof board.activeGoalId === 'string' && ids.has(board.activeGoalId) ? board.activeGoalId : board.concepts.find((item) => item.kind === 'goal')?.id ?? null,
    repairs: Array.isArray(board.repairs) ? board.repairs : [],
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
