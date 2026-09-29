import { Injectable } from '@nestjs/common';
import type { HealthStatus } from '@world-challenge/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const countriesSeeded = await this.prisma.country.count();

      return {
        status: 'ok',
        service: 'world-challenge-api',
        version: '0.1.0',
        database: 'connected',
        countriesSeeded,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'degraded',
        service: 'world-challenge-api',
        version: '0.1.0',
        database: 'disconnected',
        countriesSeeded: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
