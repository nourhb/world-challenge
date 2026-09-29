import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { AuthTokens, MeUser } from '@world-challenge/shared';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { toMeUser } from '../users/user.mapper';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { GeoIpService } from './geo-ip.service';
import { extractClientIp } from './geo-ip.util';

export const REFRESH_COOKIE = 'wc_refresh';
const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface RequestMeta {
  headers: Record<string, unknown>;
  remoteAddress?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly geoIp: GeoIpService,
  ) {}

  async register(
    dto: RegisterDto,
    response: Response,
    requestMeta: RequestMeta,
  ): Promise<AuthTokens> {
    if (!dto.termsAccepted) {
      throw new ForbiddenException('You must accept the terms to register');
    }

    const dateOfBirth = new Date(dto.dateOfBirth);
    if (Number.isNaN(dateOfBirth.getTime()) || !isAtLeast18(dateOfBirth)) {
      throw new ForbiddenException('You must be at least 18 years old');
    }

    const detected = await this.geoIp.detectFromRequest(
      requestMeta.headers,
      requestMeta.remoteAddress,
    );
    const country = dto.countryId
      ? await this.prisma.country.findUnique({ where: { id: dto.countryId } })
      : detected.country
        ? await this.prisma.country.findUnique({
            where: { id: detected.country.id },
          })
        : null;
    if (!country) {
      throw new ConflictException(
        'Could not determine your country from this network. Choose one to continue.',
      );
    }

    const email = dto.email.trim().toLowerCase();
    const username = dto.username.trim();
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: { equals: username, mode: 'insensitive' } },
        ],
      },
    });
    if (existing) {
      throw new ConflictException(
        existing.email === email
          ? 'An account with this email already exists'
          : 'This username is already taken',
      );
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        countryId: country.id,
        dateOfBirth,
        termsAcceptedAt: new Date(),
        signupIpHash: hashToken(extractClientIp(requestMeta.headers, requestMeta.remoteAddress) ?? 'unknown'),
        signupCountryIso2: detected.countryCode,
      },
      include: { country: true },
    });

    return this.issueSession(user.id, response, requestMeta);
  }

  async login(
    dto: LoginDto,
    response: Response,
    requestMeta: RequestMeta,
  ): Promise<AuthTokens> {
    const identifier = dto.identifier.trim();
    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [
          { email: identifier.toLowerCase() },
          { username: { equals: identifier, mode: 'insensitive' } },
        ],
      },
      include: { country: true },
    });

    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Invalid username/email or password');
    }
    if (user.isSuspended) {
      throw new ForbiddenException('This account is suspended');
    }

    return this.issueSession(user.id, response, requestMeta);
  }

  async refresh(rawToken: string | undefined, response: Response): Promise<AuthTokens> {
    if (!rawToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const tokenHash = hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { country: true } } },
    });

    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt.getTime() < Date.now() ||
      stored.user.deletedAt ||
      stored.user.isSuspended
    ) {
      this.clearRefreshCookie(response);
      throw new UnauthorizedException('Refresh token is invalid');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueSession(stored.userId, response);
  }

  async logout(rawToken: string | undefined, response: Response): Promise<{ loggedOut: true }> {
    if (rawToken) {
      const stored = await this.prisma.refreshToken.findUnique({
        where: { tokenHash: hashToken(rawToken) },
      });
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash: hashToken(rawToken) },
        data: { revokedAt: new Date() },
      });
      if (stored) {
        await this.prisma.user.update({
          where: { id: stored.userId },
          data: { isOnline: false },
        });
      }
    }
    this.clearRefreshCookie(response);
    return { loggedOut: true };
  }

  async me(userId: string): Promise<MeUser> {
    const user = await this.requireUser(userId);
    return toMeUser(user);
  }

  async requireUser(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { country: true },
    });
    if (!user) {
      throw new UnauthorizedException('Account was not found');
    }
    if (user.isSuspended) {
      throw new ForbiddenException('This account is suspended');
    }
    return user;
  }

  private async issueSession(
    userId: string,
    response: Response,
    requestMeta?: RequestMeta,
  ): Promise<AuthTokens> {
    if (requestMeta) {
      const detected = await this.geoIp.detectFromRequest(
        requestMeta.headers,
        requestMeta.remoteAddress,
      );
      const ip = extractClientIp(requestMeta.headers, requestMeta.remoteAddress);
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: true,
          lastLoginAt: new Date(),
          lastLoginIpHash: hashToken(ip ?? 'unknown'),
          lastLoginCountryIso2: detected.countryCode,
        },
      });
    }

    const user = await this.requireUser(userId);
    const accessToken = this.jwtService.sign(
      { sub: user.id, username: user.username },
      { expiresIn: ACCESS_TTL_SECONDS },
    );

    const rawRefresh = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawRefresh),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });

    this.setRefreshCookie(response, rawRefresh);
    return {
      accessToken,
      expiresIn: ACCESS_TTL_SECONDS,
      user: toMeUser(user),
    };
  }

  private setRefreshCookie(response: Response, token: string): void {
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    response.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: REFRESH_TTL_MS,
    });
  }

  clearRefreshCookie(response: Response): void {
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    response.clearCookie(REFRESH_COOKIE, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
  }
}

export function isAtLeast18(dateOfBirth: Date, now = new Date()): boolean {
  const eighteenth = new Date(dateOfBirth);
  eighteenth.setUTCFullYear(eighteenth.getUTCFullYear() + 18);
  return eighteenth.getTime() <= now.getTime();
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
