import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
  GameCatalogItem,
  GameResultsView,
  GameSessionView,
} from '@world-challenge/shared';
import type { AuthUser } from '../common/auth/auth-user';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { CreateSessionDto } from './dto/create-session.dto';
import { GamesService } from './games.service';

@ApiTags('games')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @ApiOperation({ summary: 'List available games' })
  list(): Promise<GameCatalogItem[]> {
    return this.gamesService.listCatalog();
  }

  @Get('sessions/mine')
  @ApiOperation({ summary: 'List the current user active sessions' })
  listMine(@CurrentUser() user: AuthUser): Promise<GameSessionView[]> {
    return this.gamesService.listMine(user.userId);
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Create a Country Quiz session' })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateSessionDto,
  ): Promise<GameSessionView> {
    return this.gamesService.createSession(user.userId, dto);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get a game session' })
  get(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<GameSessionView> {
    return this.gamesService.getSession(user.userId, id);
  }

  @Post('sessions/:id/join')
  @ApiOperation({ summary: 'Join a waiting game session' })
  join(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<GameSessionView> {
    return this.gamesService.joinSession(user.userId, id);
  }

  @Get('sessions/:id/results')
  @ApiOperation({ summary: 'Get finalized results and apply rewards once' })
  results(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<GameResultsView> {
    return this.gamesService.getResults(user.userId, id);
  }
}
