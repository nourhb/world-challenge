import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PassportController } from './passport.controller';
import { PassportService } from './passport.service';

@Module({
  imports: [AuthModule],
  controllers: [PassportController],
  providers: [PassportService],
  exports: [PassportService],
})
export class PassportModule {}
