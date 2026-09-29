import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'nour@worldchallenge.local' })
  @IsString()
  @MinLength(3)
  identifier!: string;

  @ApiProperty({ example: 'DemoPass123!' })
  @IsString()
  @MinLength(8)
  password!: string;
}
