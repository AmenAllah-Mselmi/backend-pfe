import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('test-dashboard')
  async testDashboard() {
    try {
      console.log('[Analytics] Testing dashboard without AuthGuard');
      return await this.analyticsService.getDashboard({}, 1, 'ADMIN');
    } catch (e: any) {
      return { error: e.message, stack: e.stack };
    }
  }

  // ─── New comprehensive endpoints ──────────────────────────────────────

  @UseGuards(AuthGuard)
  @Get('dashboard')
  getDashboard(
    @CurrentUser() user: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('pipelineId') pipelineId?: string,
    @Query('companyId') companyId?: string,
  ) {
    const finalUser = user || { sub: 1, role: 'ADMIN' };
    const rId = finalUser.sub || finalUser.userId || finalUser.id || 1;
    console.log('[Analytics] User Info:', { rId, role: finalUser.role, raw: user });
    
    return this.analyticsService.getDashboard(
      { from, to, userId, status, pipelineId, companyId },
      rId,
      finalUser.role || 'ADMIN'
    );
  }

  @Get('rep/:userId')
  getRepDashboard(
    @Param('userId') userId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.getRepDashboard(Number(userId), { from, to });
  }

  @Get('company/:companyId')
  getCompanyAnalytics(@Param('companyId') companyId: string) {
    return this.analyticsService.getCompanyAnalytics(Number(companyId));
  }

  @Get('contact/:contactId')
  getContactAnalytics(@Param('contactId') contactId: string) {
    return this.analyticsService.getContactAnalytics(Number(contactId));
  }

  @Get('lead/:leadId')
  getLeadAnalytics(@Param('leadId') leadId: string) {
    return this.analyticsService.getLeadAnalytics(Number(leadId));
  }

  // ─── Legacy endpoints (backward compatible) ───────────────────────────

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
