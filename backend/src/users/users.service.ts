import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  DiscoverUsersPage,
  LeaderboardView,
  MeUser,
  PublicUser,
} from '@world-challenge/shared';
import { PrismaService } from '../prisma/prisma.service';
import { toMeUser, toPublicUser } from './user.mapper';
import type { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<MeUser> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { country: true },
    });
    if (!user) {
      throw new NotFoundException('User was not found');
    }
    return toMeUser(user);
  }

  async updateMe(userId: string, dto: UpdateProfileDto): Promise<MeUser> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        bio: dto.bio,
        avatarUrl: dto.avatarUrl,
        language: dto.language,
      },
      include: { country: true },
    });
    return toMeUser(user);
  }

  async getPublicById(viewerId: string, userId: string): Promise<PublicUser> {
    const blocked = await this.isEitherBlocked(viewerId, userId);
    if (blocked) {
      throw new NotFoundException('User was not found');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
        isSuspended: false,
      },
      include: { country: true },
    });
    if (!user) {
      throw new NotFoundException('User was not found');
    }
    return toPublicUser(user);
  }

  async discover(viewerId: string, search?: string): Promise<DiscoverUsersPage> {
    const blocks = await this.prisma.block.findMany({
      where: {
        OR: [{ blockerId: viewerId }, { blockedId: viewerId }],
      },
    });
    const hiddenIds = new Set<string>([viewerId]);
    for (const block of blocks) {
      hiddenIds.add(block.blockerId);
      hiddenIds.add(block.blockedId);
    }

    const where = {
      deletedAt: null,
      isSuspended: false,
      id: { notIn: [...hiddenIds] },
      ...(search
        ? {
            OR: [
              { username: { contains: search, mode: 'insensitive' as const } },
              { country: { name: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: { country: true },
        orderBy: [{ isOnline: 'desc' }, { xp: 'desc' }, { username: 'asc' }],
        take: 50,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users.map(toPublicUser),
      total,
    };
  }

  async leaderboard(): Promise<LeaderboardView> {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null, isSuspended: false },
      include: { country: true },
      orderBy: [{ xp: 'desc' }, { level: 'desc' }, { username: 'asc' }],
      take: 25,
    });

    return {
      items: users.map((user, index) => ({
        ...toPublicUser(user),
        rank: index + 1,
      })),
    };
  }

  private async isEitherBlocked(a: string, b: string): Promise<boolean> {
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: a, blockedId: b },
          { blockerId: b, blockedId: a },
        ],
      },
    });
    return Boolean(block);
  }
}
