import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type {
  AuthTokens,
  GeoLocation,
  MeUser,
  PasswordResetRequestResult,
  PasswordResetResult,
} from '@world-challenge/shared';
import type { Request, Response } from 'express';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import type { AuthUser } from '../common/auth/auth-user';
import { AuthService, REFRESH_COOKIE } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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

  @Post('forgot-password')
  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @ApiOperation({ summary: 'Start a password reset for a username or email' })
  forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<PasswordResetRequestResult> {
    return this.authService.requestPasswordReset(dto.identifier);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 8, ttl: 3_600_000 } })
  @ApiOperation({ summary: 'Set a new password with a reset token' })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<PasswordResetResult> {
    return this.authService.resetPassword(dto.token, dto.password);
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
