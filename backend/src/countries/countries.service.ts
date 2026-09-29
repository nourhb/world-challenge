import { Injectable, NotFoundException } from '@nestjs/common';
import type { CountrySummary } from '@world-challenge/shared';
import { PrismaService } from '../prisma/prisma.service';
import { toCountrySummary } from '../users/user.mapper';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<CountrySummary[]> {
    const countries = await this.prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
    return countries.map(toCountrySummary);
  }

  async getById(id: string): Promise<CountrySummary> {
    const country = await this.prisma.country.findUnique({ where: { id } });
    if (!country) {
      throw new NotFoundException('Country was not found');
    }
    return toCountrySummary(country);
  }
}
