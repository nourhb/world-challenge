import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty()
  @IsString()
  questionId!: string;

  @ApiProperty()
  @IsString()
  answer!: string;
}
