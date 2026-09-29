import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameMode, GameType } from '@world-challenge/shared';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ enum: GameType, example: GameType.COUNTRY_QUIZ })
  @IsEnum(GameType)
  gameType!: GameType;

  @ApiProperty({ enum: GameMode, example: GameMode.SOLO })
  @IsEnum(GameMode)
  mode!: GameMode;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  invitedUserId?: string;
}
