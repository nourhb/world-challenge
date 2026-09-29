import { Injectable } from '@nestjs/common';
import {
  GameMode,
  GameStatus,
  PassportStatus,
  type GameResultsView,
} from '@world-challenge/shared';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PassportService } from '../../passport/passport.service';
import { XpService } from '../xp/xp.service';

@Injectable()
export class RewardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
    private readonly passportService: PassportService,
  ) {}

  async finalizeSession(sessionId: string): Promise<GameResultsView> {
    return this.prisma.$transaction(async (tx) => {
      const session = await tx.gameSession.findUnique({
        where: { id: sessionId },
        include: {
          game: true,
          players: {
            include: { user: { include: { country: true } } },
          },
          answers: true,
        },
      });

      if (!session) {
        throw new Error('Session was not found');
      }

      if (session.rewardsProcessedAt) {
        return this.toResults(session);
      }

      const isMultiplayer =
        session.maxPlayers > 1 && session.players.length > 1;
      const unlockedCountries: GameResultsView['unlockedCountries'] = [];

      for (const player of session.players) {
        const playerAnswers = session.answers.filter(
          (answer) => answer.playerId === player.userId,
        );
        const correctAnswers = playerAnswers.filter((answer) => answer.isCorrect)
          .length;

        let discoveredNewCountry = false;
        let firstGameWithCountry = false;

        if (isMultiplayer) {
          const opponent = session.players.find(
            (other) => other.userId !== player.userId,
          );
          if (opponent) {
            const existing = await tx.userCountry.findUnique({
              where: {
                userId_countryId: {
                  userId: player.userId,
                  countryId: opponent.user.countryId,
                },
              },
            });
            firstGameWithCountry = !existing;
            const unlocked = await this.passportService.unlockOpponentCountry(
              tx,
              player.userId,
              opponent.user.countryId,
              player.score,
            );
            if (unlocked) {
              discoveredNewCountry = firstGameWithCountry;
              unlockedCountries.push({
                userId: player.userId,
                country: unlocked,
              });
            }
          }
        }

        const xpAwarded = this.xpService.computeGameXp({
          correctAnswers,
          discoveredNewCountry,
          firstGameWithCountry: discoveredNewCountry && firstGameWithCountry,
        });
        await this.xpService.awardXp(tx, player.userId, xpAwarded);
        await this.checkBadges(tx, player.userId, correctAnswers, session.questionIds.length);
        await tx.gamePlayer.update({
          where: { id: player.id },
          data: { xpAwarded, finishedAt: new Date() },
        });
      }

      await tx.gameSession.update({
        where: { id: session.id },
        data: {
          status: GameStatus.FINISHED,
          finishedAt: session.finishedAt ?? new Date(),
          rewardsProcessedAt: new Date(),
        },
      });

      const refreshed = await tx.gameSession.findUniqueOrThrow({
        where: { id: session.id },
        include: {
          game: true,
          players: {
            include: { user: { include: { country: true } } },
          },
          answers: true,
        },
      });

      const results = this.toResults(refreshed);
      return {
        ...results,
        unlockedCountries:
          unlockedCountries.length > 0
            ? unlockedCountries
            : results.unlockedCountries,
      };
    });
  }

  private async checkBadges(
    tx: Prisma.TransactionClient,
    userId: string,
    correctAnswers: number,
    totalRounds: number,
  ): Promise<void> {
    const unlockedCount = await tx.userCountry.count({
      where: {
        userId,
        status: {
          in: [PassportStatus.COMPLETED, PassportStatus.MASTERED],
        },
      },
    });
    const gamesCompleted = await tx.gamePlayer.count({
      where: { userId, finishedAt: { not: null } },
    });

    const badges = await tx.badge.findMany();
    for (const badge of badges) {
      const earned =
        (badge.criteriaType === 'COUNTRIES_UNLOCKED' &&
          unlockedCount >= badge.criteriaValue) ||
        (badge.criteriaType === 'GAMES_COMPLETED' &&
          gamesCompleted >= badge.criteriaValue) ||
        (badge.criteriaType === 'PERFECT_QUIZ' &&
          correctAnswers === totalRounds &&
          totalRounds > 0);

      if (!earned) {
        continue;
      }

      await tx.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
        create: { userId, badgeId: badge.id },
        update: {},
      });
    }
  }

  private toResults(session: {
    id: string;
    status: string;
    mode: string;
    players: Array<{
      userId: string;
      score: number;
      ready: boolean;
      xpAwarded: number;
      user: {
        username: string;
        avatarUrl: string | null;
        country: {
          id: string;
          iso2: string;
          iso3: string;
          name: string;
          officialName: string | null;
          capital: string | null;
          continent: string | null;
          region: string | null;
          flagEmoji: string | null;
          flagUrl: string | null;
        };
      };
    }>;
    answers: Array<{ playerId: string; isCorrect: boolean }>;
  }): GameResultsView {
    const players = session.players.map((player) => ({
      userId: player.userId,
      username: player.user.username,
      avatarUrl: player.user.avatarUrl,
      countryName: player.user.country.name,
      countryFlag: player.user.country.flagEmoji,
      score: player.score,
      ready: player.ready,
      xpAwarded: player.xpAwarded,
      correctAnswers: session.answers.filter(
        (answer) => answer.playerId === player.userId && answer.isCorrect,
      ).length,
    }));

    const topScore = Math.max(0, ...players.map((player) => player.score));
    const leaders = players.filter((player) => player.score === topScore);
    const winnerUserId =
      session.mode !== GameMode.SOLO && leaders.length === 1
        ? (leaders[0]?.userId ?? null)
        : null;

    return {
      sessionId: session.id,
      status: session.status as GameResultsView['status'],
      mode: session.mode as GameResultsView['mode'],
      players,
      winnerUserId,
      unlockedCountries: [],
    };
  }
}
