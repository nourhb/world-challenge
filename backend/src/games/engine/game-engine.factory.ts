import { BadRequestException, Injectable } from '@nestjs/common';
import { GameType, isPlayableGameType } from '@world-challenge/shared';
import type { GameEngine } from './game-engine';
import { QuestionBankEngine } from './question-bank.engine';
import { WorldMapEngine } from './world-map.engine';

@Injectable()
export class GameEngineFactory {
  constructor(
    private readonly questionBank: QuestionBankEngine,
    private readonly worldMapEngine: WorldMapEngine,
  ) {}

  getEngine(gameType: GameType): GameEngine {
    if (gameType === GameType.WORLD_MAP) {
      return this.worldMapEngine;
    }
    if (isPlayableGameType(gameType)) {
      return this.questionBank.bind(gameType);
    }

    throw new BadRequestException(`${gameType} is not a live game yet`);
  }
}
