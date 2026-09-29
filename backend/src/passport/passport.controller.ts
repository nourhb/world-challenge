import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { PassportView } from '@world-challenge/shared';
import type { AuthUser } from '../common/auth/auth-user';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { PassportService } from './passport.service';

@ApiTags('passport')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class PassportController {
  constructor(private readonly passportService: PassportService) {}

  @Get('passport')
  @ApiOperation({ summary: 'Get the current user virtual passport' })
  getMine(@CurrentUser() user: AuthUser): Promise<PassportView> {
    return this.passportService.getMine(user.userId);
  }
}
