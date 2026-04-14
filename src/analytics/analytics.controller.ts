import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  getStats() {
    return this.analyticsService.getStats();
  }

  @Get('charts/revenue')
  getRevenueData() {
    return this.analyticsService.getRevenueData();
  }
  
  @Get('charts/pipeline')
  getPipelineData() {
    return this.analyticsService.getPipelineData();
  }

  @Get('charts/deals')
  getDealsData() {
    return this.analyticsService.getDealsData();
  }
}
