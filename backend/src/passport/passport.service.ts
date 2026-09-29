import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStatus } from '@world-challenge/shared';
import type { CountrySummary, PassportView } from '@world-challenge/shared';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { toCountrySummary } from '../users/user.mapper';

type Tx = Prisma.TransactionClient;

@Injectable()
export class PassportService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string): Promise<PassportView> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { country: true, userCountries: true },
    });
    if (!user) {
      throw new NotFoundException('User was not found');
    }

    const countries = await this.prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
    const progressByCountry = new Map(
      user.userCountries.map((entry) => [entry.countryId, entry]),
    );

    const homeCountry = toCountrySummary(user.country);
    const entries = countries.map((country) => {
      const isHome = country.id === user.countryId;
      const progress = progressByCountry.get(country.id);
      const status = isHome
        ? PassportStatus.COMPLETED
        : ((progress?.status as PassportStatus | undefined) ??
          PassportStatus.LOCKED);

      return {
        country: toCountrySummary(country),
        status,
        isHome,
        gamesPlayed: progress?.gamesPlayed ?? 0,
        bestScore: progress?.bestScore ?? 0,
        discoveredAt: progress?.discoveredAt?.toISOString() ?? null,
        completedAt: progress?.completedAt?.toISOString() ?? null,
      };
    });

    return {
      homeCountry,
      totalCount: countries.length,
      unlockedCount: entries.filter(
        (entry) => !entry.isHome && entry.status !== PassportStatus.LOCKED,
      ).length,
      countries: entries,
    };
  }

  async unlockOpponentCountry(
    tx: Tx,
    userId: string,
    opponentCountryId: string,
    score: number,
  ): Promise<CountrySummary | null> {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { country: true },
    });
    if (!user || user.countryId === opponentCountryId) {
      return null;
    }

    const country = await tx.country.findUnique({
      where: { id: opponentCountryId },
    });
    if (!country) {
      return null;
    }

    const now = new Date();
    const existing = await tx.userCountry.findUnique({
      where: {
        userId_countryId: { userId, countryId: opponentCountryId },
      },
    });

    await tx.userCountry.upsert({
      where: {
        userId_countryId: { userId, countryId: opponentCountryId },
      },
      create: {
        userId,
        countryId: opponentCountryId,
        status: PassportStatus.COMPLETED,
        discoveredAt: now,
        completedAt: now,
        gamesPlayed: 1,
        bestScore: score,
      },
      update: {
        status: PassportStatus.COMPLETED,
        discoveredAt: existing?.discoveredAt ?? now,
        completedAt: existing?.completedAt ?? now,
        gamesPlayed: { increment: 1 },
        bestScore: Math.max(existing?.bestScore ?? 0, score),
      },
    });

    return toCountrySummary(country);
  }
}
