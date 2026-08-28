import type { BoardState, Concept, Edge, KnowledgeStatus } from './types';

const created = '2026-08-01T09:00:00.000Z';

function concept(id: string, title: string, status: KnowledgeStatus, kind: Concept['kind'] = 'concept', notes = ''): Concept {
  return { id, title, status, kind, notes, createdAt: created, updatedAt: created };
}

function edge(prerequisiteId: string, dependentId: string): Edge {
  return { id: `${prerequisiteId}:${dependentId}`, prerequisiteId, dependentId };
}

export function sampleBoard(): BoardState {
  return {
    version: 1,
    name: 'Relearn derivatives',
    activeGoalId: 'goal-derivatives',
    updatedAt: created,
    repairs: [
      { id: 'repair-1', conceptId: 'function-notation', conceptTitle: 'Function notation', status: 'solve', at: '2026-08-04T18:20:00.000Z' },
      { id: 'repair-2', conceptId: 'graphs', conceptTitle: 'Read a function graph', status: 'solve', at: '2026-08-08T10:15:00.000Z' },
      { id: 'repair-3', conceptId: 'exponents', conceptTitle: 'Exponent laws', status: 'explain', at: '2026-08-11T19:00:00.000Z' },
      { id: 'repair-4', conceptId: 'substitution', conceptTitle: 'Substitute values', status: 'solve', at: '2026-08-15T08:40:00.000Z' },
      { id: 'repair-5', conceptId: 'decimals', conceptTitle: 'Estimate with decimals', status: 'solve', at: '2026-08-19T17:30:00.000Z' }
    ],
    concepts: [
      concept('goal-derivatives', 'Explain what a derivative means', 'not_yet', 'goal', 'Use a graph and the limit definition, not only a rule.'),
      concept('definition', 'Derivative definition', 'not_yet'),
      concept('tangent', 'Tangent as local slope', 'not_yet'),
      concept('limits', 'Limits', 'not_yet'),
      concept('quotients', 'Difference quotients', 'explain'),
      concept('graphs', 'Read a function graph', 'solve'),
      concept('approach', 'Approaching a value', 'not_yet'),
      concept('decimals', 'Estimate with decimals', 'solve'),
      concept('function-notation', 'Function notation', 'solve'),
      concept('simplify', 'Algebraic simplification', 'not_yet'),
      concept('fractions', 'Fraction arithmetic', 'not_yet', 'concept', 'Practice one worked subtraction with unlike denominators.'),
      concept('exponents', 'Exponent laws', 'explain'),
      concept('substitution', 'Substitute values', 'solve'),
      concept('slope', 'Slope between two points', 'explain')
    ],
    edges: [
      edge('definition', 'goal-derivatives'), edge('tangent', 'goal-derivatives'),
      edge('limits', 'definition'), edge('quotients', 'definition'),
      edge('graphs', 'tangent'), edge('slope', 'tangent'),
      edge('approach', 'limits'), edge('decimals', 'approach'),
      edge('function-notation', 'quotients'), edge('simplify', 'quotients'),
      edge('fractions', 'simplify'), edge('exponents', 'simplify'),
      edge('substitution', 'function-notation'), edge('fractions', 'slope')
    ]
  };
}
