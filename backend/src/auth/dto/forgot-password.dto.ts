import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'nour@worldchallenge.local' })
  @IsString()
  @MinLength(3)
  identifier!: string;
}
