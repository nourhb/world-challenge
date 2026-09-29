import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '../passport/passport.module';
import { CountryQuizEngine } from './engine/country-quiz.engine';
import { GameEngineFactory } from './engine/game-engine.factory';
import { QuestionBankEngine } from './engine/question-bank.engine';
import { WorldMapEngine } from './engine/world-map.engine';
import { GameGateway } from './game.gateway';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { RewardsService } from './rewards/rewards.service';
import { ScoringService } from './scoring/scoring.service';
import { XpService } from './xp/xp.service';

@Module({
  imports: [AuthModule, PassportModule],
  controllers: [GamesController],
  providers: [
    GamesService,
    GameGateway,
    GameEngineFactory,
    CountryQuizEngine,
    QuestionBankEngine,
    WorldMapEngine,
    ScoringService,
    XpService,
    RewardsService,
  ],
  exports: [GamesService],
})
export class GamesModule {}
