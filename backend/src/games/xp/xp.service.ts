import { Injectable } from '@nestjs/common';
import { levelFromTotalXp, XP_REWARDS } from '@world-challenge/shared';
import type { Prisma } from '@prisma/client';

type Tx = Prisma.TransactionClient;

@Injectable()
export class XpService {
  computeGameXp(input: {
    correctAnswers: number;
    discoveredNewCountry: boolean;
    firstGameWithCountry: boolean;
  }): number {
    return (
      XP_REWARDS.completeGame +
      input.correctAnswers * XP_REWARDS.correctAnswer +
      (input.discoveredNewCountry ? XP_REWARDS.discoverCountry : 0) +
      (input.firstGameWithCountry ? XP_REWARDS.firstGameWithCountry : 0)
    );
  }

  async awardXp(
    tx: Tx,
    userId: string,
    amount: number,
  ): Promise<{ xp: number; level: number }> {
    if (amount <= 0) {
      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      return { xp: user.xp, level: user.level };
    }

    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const xp = user.xp + amount;
    const level = levelFromTotalXp(xp);
    await tx.user.update({
      where: { id: userId },
      data: { xp, level },
    });
    return { xp, level };
  }
}
