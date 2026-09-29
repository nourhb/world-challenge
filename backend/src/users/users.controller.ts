import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { DiscoverUsersPage, MeUser, PublicUser } from '@world-challenge/shared';
import type { AuthUser } from '../common/auth/auth-user';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile' })
  getMe(@CurrentUser() user: AuthUser): Promise<MeUser> {
    return this.usersService.getMe(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current user profile' })
  updateMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<MeUser> {
    return this.usersService.updateMe(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Discover other players' })
  discover(
    @CurrentUser() user: AuthUser,
    @Query('search') search?: string,
  ): Promise<DiscoverUsersPage> {
    return this.usersService.discover(user.userId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a public player profile' })
  getById(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<PublicUser> {
    return this.usersService.getPublicById(user.userId, id);
  }
}
