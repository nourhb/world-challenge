import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { AuthTokens, GeoLocation, MeUser } from '@world-challenge/shared';
import type { Request, Response } from 'express';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import type { AuthUser } from '../common/auth/auth-user';
import { AuthService, REFRESH_COOKIE } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GeoIpService } from './geo-ip.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly geoIp: GeoIpService,
  ) {}

  @Get('location')
  @ApiOperation({ summary: 'Detect country from the caller IP address' })
  location(@Req() request: Request): Promise<GeoLocation> {
    return this.geoIp.detectFromRequest(
      request.headers as Record<string, unknown>,
      request.socket.remoteAddress,
    );
  }

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @ApiOperation({ summary: 'Create an account and start a session' })
  register(
    @Body() dto: RegisterDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthTokens> {
    return this.authService.register(dto, response, requestMeta(request));
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Log in with username/email and password' })
  login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthTokens> {
    return this.authService.login(dto, response, requestMeta(request));
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rotate the refresh cookie and issue a new access token' })
  refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthTokens> {
    return this.authService.refresh(readRefreshCookie(request), response);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Revoke the refresh token and clear the cookie' })
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ loggedOut: true }> {
    return this.authService.logout(readRefreshCookie(request), response);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the authenticated user' })
  me(@CurrentUser() user: AuthUser): Promise<MeUser> {
    return this.authService.me(user.userId);
  }
}

function readRefreshCookie(request: Request): string | undefined {
  const cookies = request.cookies as Record<string, string> | undefined;
  return cookies?.[REFRESH_COOKIE];
}

function requestMeta(request: Request): {
  headers: Record<string, unknown>;
  remoteAddress?: string;
} {
  return {
    headers: request.headers as Record<string, unknown>,
    remoteAddress: request.socket.remoteAddress,
  };
}
