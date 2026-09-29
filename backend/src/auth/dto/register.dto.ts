import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Nour' })
  @IsString()
  @MinLength(3)
  @MaxLength(24)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username may only contain letters, numbers, and underscores',
  })
  username!: string;

  @ApiProperty({ example: 'nour@worldchallenge.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'DemoPass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  countryId?: string;

  @ApiProperty({ example: '1998-04-12' })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  termsAccepted!: boolean;
}
