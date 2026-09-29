import { Injectable, Logger } from '@nestjs/common';
import type { CountrySummary, GeoLocation } from '@world-challenge/shared';
import { PrismaService } from '../prisma/prisma.service';
import { toCountrySummary } from '../users/user.mapper';
import { extractClientIp, isPrivateIp, maskIp } from './geo-ip.util';

interface IpWhoResponse {
  success?: boolean;
  ip?: string;
  country?: string;
  country_code?: string;
  city?: string;
  region?: string;
}

@Injectable()
export class GeoIpService {
  private readonly logger = new Logger(GeoIpService.name);

  constructor(private readonly prisma: PrismaService) {}

  async detectFromRequest(
    headers: Record<string, unknown>,
    remoteAddress?: string,
  ): Promise<GeoLocation> {
    const requestIp = extractClientIp(headers, remoteAddress);
    const lookupIp = requestIp && !isPrivateIp(requestIp) ? requestIp : undefined;
    const lookup = await this.lookup(lookupIp);

    const iso2 = lookup.countryCode?.toUpperCase() ?? null;
    const country = iso2
      ? await this.prisma.country.findUnique({ where: { iso2 } })
      : null;

    return {
      ip: maskIp(lookup.ip ?? requestIp ?? '0.0.0.0'),
      country: country ? toCountrySummary(country) : null,
      countryCode: iso2,
      city: lookup.city,
      region: lookup.region,
      source: 'ip',
      isApproximate: true,
    };
  }

  async countryFromRequest(
    headers: Record<string, unknown>,
    remoteAddress?: string,
  ): Promise<CountrySummary | null> {
    const location = await this.detectFromRequest(headers, remoteAddress);
    return location.country;
  }

  private async lookup(ip?: string): Promise<{
    ip: string | null;
    countryCode: string | null;
    city: string | null;
    region: string | null;
  }> {
    const url = ip
      ? `https://ipwho.is/${encodeURIComponent(ip)}`
      : 'https://ipwho.is/';

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(3500),
      });
      if (!response.ok) {
        return emptyLookup();
      }

      const body = (await response.json()) as IpWhoResponse;
      if (body.success === false) {
        return emptyLookup();
      }

      return {
        ip: body.ip ?? ip ?? null,
        countryCode: body.country_code ?? null,
        city: body.city ?? null,
        region: body.region ?? null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'lookup failed';
      this.logger.warn(`IP country lookup failed: ${message}`);
      return emptyLookup();
    }
  }
}

function emptyLookup(): {
  ip: string | null;
  countryCode: string | null;
  city: string | null;
  region: string | null;
} {
  return { ip: null, countryCode: null, city: null, region: null };
}
