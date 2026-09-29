import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { CountrySummary } from '@world-challenge/shared';
import { CountriesService } from './countries.service';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'List seeded countries' })
  list(): Promise<CountrySummary[]> {
    return this.countriesService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one country' })
  getById(@Param('id') id: string): Promise<CountrySummary> {
    return this.countriesService.getById(id);
  }
}
