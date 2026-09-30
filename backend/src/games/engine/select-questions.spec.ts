import { pickStratifiedIds } from './select-questions';

describe('pickStratifiedIds', () => {
  it('escalates from easier items to harder ones', () => {
    const questions = [
      { id: 'e1', difficulty: 1 },
      { id: 'e2', difficulty: 2 },
      { id: 'm1', difficulty: 3 },
      { id: 'h1', difficulty: 4 },
      { id: 'h2', difficulty: 5 },
    ];
    const picked = pickStratifiedIds(questions, 5);
    expect(picked).toHaveLength(5);
    const byId = new Map(questions.map((question) => [question.id, question]));
    const difficulties = picked.map((id) => byId.get(id)?.difficulty ?? 0);
    expect([...difficulties].sort((a, b) => a - b)).toEqual(difficulties);
  });
});
