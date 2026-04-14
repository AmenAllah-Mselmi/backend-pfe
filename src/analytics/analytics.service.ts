import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const deals = await this.prisma.deal.findMany();
    const wonDeals = deals.filter(d => d.status === 'WON');
    
    const revenue = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const totalDeals = deals.length;
    const conversion = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0;
    const avgDeal = wonDeals.length > 0 ? revenue / wonDeals.length : 0;

    return {
      revenue: { value: `$${(revenue / 1000).toFixed(1)}k`, change: '+0%', trend: 'up' },
      deals: { value: `${totalDeals}`, change: '+0', trend: 'up' },
      conversion: { value: `${conversion.toFixed(1)}%`, change: '+0%', trend: 'up' },
      avgDeal: { value: `$${(avgDeal / 1000).toFixed(1)}k`, change: '+0%', trend: 'up' },
      winRate: { value: `${conversion.toFixed(1)}%`, change: '+0%', trend: 'up' },
      velocity: { value: '14 days', change: '0', trend: 'up' }
    };
  }

  async getRevenueData() {
    return [
      { month: 'Jan', value: 30000 },
      { month: 'Feb', value: 45000 },
      { month: 'Mar', value: 40000 },
      { month: 'Apr', value: 55000 },
      { month: 'May', value: 65000 }
    ];
  }

  async getPipelineData() {
    const pipelines = await this.prisma.pipeline.findMany({ include: { leads: true } });
    return pipelines.map(p => ({
      stage: p.name,
      value: p.leads.length * 10000 // Approximate value per stage
    }));
  }

  async getDealsData() {
    return [
      { month: 'Jan', won: 15, lost: 5, proposal: 8 },
      { month: 'Feb', won: 18, lost: 4, proposal: 10 },
      { month: 'Mar', won: 22, lost: 6, proposal: 12 }
    ];
  }
}
