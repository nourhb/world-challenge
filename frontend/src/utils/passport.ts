export function formatPassportProgress(
  unlocked: number,
  total: number,
): string {
  if (unlocked < 0 || total <= 0 || unlocked > total) {
    throw new Error('Passport progress values are invalid');
  }

  return `${unlocked} / ${total} countries unlocked`;
}
