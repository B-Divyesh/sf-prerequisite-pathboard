export type KnowledgeStatus = 'not_yet' | 'explain' | 'solve';

export interface Concept {
  id: string;
  title: string;
  notes: string;
  kind: 'goal' | 'concept';
  status: KnowledgeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Edge {
  id: string;
  prerequisiteId: string;
  dependentId: string;
}

export interface RepairEntry {
  id: string;
  conceptId: string;
  conceptTitle: string;
  status: KnowledgeStatus;
  at: string;
}

export interface BoardState {
  version: 1;
  name: string;
  concepts: Concept[];
  edges: Edge[];
  activeGoalId: string | null;
  repairs: RepairEntry[];
  updatedAt: string;
}

export const emptyBoard = (): BoardState => ({
  version: 1,
  name: 'My pathboard',
  concepts: [],
  edges: [],
  activeGoalId: null,
  repairs: [],
  updatedAt: new Date().toISOString()
});
