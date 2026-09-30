import { NotFoundException } from '@nestjs/common';
import { GameType, QUIZ_ROUND_COUNT } from '@world-challenge/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { shuffle } from './shuffle';

export async function selectStratifiedQuestionIds(
  prisma: PrismaService,
  gameType: GameType,
  count = QUIZ_ROUND_COUNT,
): Promise<string[]> {
  const questions = await prisma.question.findMany({
    where: { gameType, isActive: true },
    select: { id: true, difficulty: true },
  });

  if (questions.length < count) {
    throw new NotFoundException(
      `${gameType} needs at least ${count} seeded questions`,
    );
  }

  return pickStratifiedIds(questions, count);
}

export function pickStratifiedIds(
  questions: Array<{ id: string; difficulty: number }>,
  count: number,
): string[] {
  const shuffled = shuffle(questions);
  const easy = shuffled.filter((question) => question.difficulty <= 2);
  const mid = shuffled.filter((question) => question.difficulty === 3);
  const hard = shuffled.filter((question) => question.difficulty >= 4);

  const easyWant = Math.min(easy.length, Math.max(1, Math.round(count * 0.4)));
  const hardWant = Math.min(hard.length, Math.max(0, Math.round(count * 0.2)));
  const midWant = Math.min(mid.length, Math.max(0, count - easyWant - hardWant));

  const picked = [
    ...easy.slice(0, easyWant),
    ...mid.slice(0, midWant),
    ...hard.slice(0, hardWant),
  ];
  const used = new Set(picked.map((question) => question.id));

  for (const question of shuffled) {
    if (picked.length >= count) {
      break;
    }
    if (!used.has(question.id)) {
      picked.push(question);
      used.add(question.id);
    }
  }

  return picked
    .slice(0, count)
    .sort((left, right) => left.difficulty - right.difficulty)
    .map((question) => question.id);
}
