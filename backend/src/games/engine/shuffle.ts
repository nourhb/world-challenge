export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    const other = copy[swap];
    if (current === undefined || other === undefined) {
      continue;
    }
    copy[index] = other;
    copy[swap] = current;
  }
  return copy;
}
