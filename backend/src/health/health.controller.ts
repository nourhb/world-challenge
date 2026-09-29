import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { HealthStatus } from '@world-challenge/shared';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Service and database health' })
  getHealth(): Promise<HealthStatus> {
    return this.healthService.getHealth();
  }
}
