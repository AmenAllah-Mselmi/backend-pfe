import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // ─── ADMIN: Full Dashboard ────────────────────────────────────────────
  async getDashboard(
    query: { from?: string; to?: string; userId?: string; status?: string; pipelineId?: string; companyId?: string },
    requesterId: any,
    requesterRole: string
  ) {
    const role = (requesterRole || 'ADMIN').toUpperCase();
    console.log(`[Analytics] Fetching dashboard for User ${requesterId} (${role})`, query);
    const dateFilter = this.buildDateFilter(query.from, query.to);
    
    // Ensure requesterId is a number
    const rId = typeof requesterId === 'string' ? parseInt(requesterId, 10) : Number(requesterId);
    if (isNaN(rId)) {
      console.error('[Analytics] Invalid requesterId:', requesterId);
      throw new Error('Invalid user ID');
    }

    // ── Hierarchy Filtering ──
    const userFilter: any = query.userId 
      ? { userId: Number(query.userId) } 
      : role === 'ADMIN' 
        ? { OR: [
            { userId: rId },
            { user: { managerId: rId } },
            { userId: null }
          ]}
        : { userId: rId };
        
    const strictUserFilter: any = query.userId 
      ? { userId: Number(query.userId) } 
      : role === 'ADMIN' 
        ? { OR: [
            { userId: rId },
            { user: { managerId: rId } }
          ]}
        : { userId: rId };
      
    const statusFilter = query.status ? { status: query.status as any } : {};
    const companyFilter = query.companyId ? { companyId: Number(query.companyId) } : {};

    const [
      leads, contacts, companies, deals, tasks, activities, users, pipelines, tickets, notes
    ] = await Promise.all([
      this.prisma.lead.findMany({ where: { isDeleted: false, ...userFilter, ...statusFilter, ...companyFilter, createdAt: dateFilter }, include: { leadScore: true, company: true, user: true } }),
      this.prisma.contact.findMany({ where: { ...userFilter, createdAt: dateFilter } }),
      this.prisma.company.findMany({ where: { createdAt: dateFilter } }),
      this.prisma.deal.findMany({ where: { ...userFilter, createdAt: dateFilter }, include: { lead: true, pipeline: true } }),
      this.prisma.task.findMany({ where: { ...strictUserFilter, createdAt: dateFilter } }),
      this.prisma.activity.findMany({ where: { ...strictUserFilter, createdAt: dateFilter } }),
      this.prisma.user.findMany({ 
        where: role === 'ADMIN' 
          ? { OR: [{ id: rId }, { managerId: rId }] } 
          : { id: rId } 
      }),
      this.prisma.pipeline.findMany({ include: { leads: true, deals: true } }),
      this.prisma.ticket.findMany({ where: { ...strictUserFilter, createdAt: dateFilter } }),
      this.prisma.note.findMany({ where: { ...strictUserFilter, createdAt: dateFilter } }),
    ]);

    // ── Global Stats ──
    const wonDeals = deals.filter(d => d.status === 'WON');
    const lostDeals = deals.filter(d => d.status === 'LOST');
    const qualifiedLeads = leads.filter(l => l.status === 'QUALIFIED');
    const lostLeads = leads.filter(l => l.status === 'LOST');
    const totalRevenue = wonDeals.reduce((s, d) => s + d.amount, 0);
    const pipelineValue = deals.filter(d => !['WON', 'LOST', 'CLOSED'].includes(d.status)).reduce((s, d) => s + d.amount, 0);
    const closedCount = qualifiedLeads.length + lostLeads.length;
    const conversionRate = closedCount > 0 ? (qualifiedLeads.length / closedCount) * 100 : 0;

    const globalStats = {
      totalLeads: leads.length,
      totalContacts: contacts.length,
      totalCompanies: companies.length,
      totalDeals: deals.length,
      leadsWon: qualifiedLeads.length,
      leadsLost: lostLeads.length,
      dealsWon: wonDeals.length,
      dealsLost: lostDeals.length,
      conversionRate: Math.round(conversionRate * 10) / 10,
      pipelineValue,
      totalRevenue,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
      totalActivities: activities.length,
      totalTickets: tickets.length,
      totalNotes: notes.length,
    };

    // ── Monthly Growth ──
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthlyGrowth = monthNames.map((month, idx) => {
      const mLeads = leads.filter(l => new Date(l.createdAt).getMonth() === idx);
      const mDeals = deals.filter(d => new Date(d.createdAt).getMonth() === idx);
      const mWon = mDeals.filter(d => d.status === 'WON');
      const mLost = mDeals.filter(d => d.status === 'LOST');
      const mActivities = activities.filter(a => new Date(a.createdAt).getMonth() === idx);
      return {
        month,
        leads: mLeads.length,
        deals: mDeals.length,
        won: mWon.length,
        lost: mLost.length,
        revenue: mWon.reduce((s, d) => s + d.amount, 0),
        activities: mActivities.length,
      };
    });

    // ── Status Analysis ──
    const statusAnalysis = {
      leads: {
        NEW: leads.filter(l => l.status === 'NEW').length,
        CONTACTED: leads.filter(l => l.status === 'CONTACTED').length,
        QUALIFIED: leads.filter(l => l.status === 'QUALIFIED').length,
        LOST: leads.filter(l => l.status === 'LOST').length,
      },
      deals: {
        PENDING: deals.filter(d => d.status === 'PENDING').length,
        ACTIVE: deals.filter(d => d.status === 'ACTIVE').length,
        WON: wonDeals.length,
        LOST: lostDeals.length,
        ON_HOLD: deals.filter(d => d.status === 'ON_HOLD').length,
      },
      tasks: {
        PENDING: tasks.filter(t => t.status === 'PENDING').length,
        IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length,
        OVERDUE: tasks.filter(t => t.status === 'OVERDUE').length,
      },
    };

    // ── Rep Performance ──
    const repPerformance = users.map(u => {
      const uLeads = leads.filter(l => l.userId === u.id);
      const uDeals = deals.filter(d => d.userId === u.id);
      const uWon = uDeals.filter(d => d.status === 'WON');
      const uActivities = activities.filter(a => a.userId === u.id);
      const uTasks = tasks.filter(t => t.userId === u.id);
      const uCompletedTasks = uTasks.filter(t => t.status === 'COMPLETED');
      const uRevenue = uWon.reduce((s, d) => s + d.amount, 0);
      const uQualified = uLeads.filter(l => l.status === 'QUALIFIED').length;
      const uClosed = uLeads.filter(l => ['QUALIFIED', 'LOST'].includes(l.status)).length;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        totalLeads: uLeads.length,
        totalDeals: uDeals.length,
        dealsWon: uWon.length,
        revenue: uRevenue,
        conversionRate: uClosed > 0 ? Math.round((uQualified / uClosed) * 1000) / 10 : 0,
        activities: uActivities.length,
        completedTasks: uCompletedTasks.length,
        totalTasks: uTasks.length,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // ── Pipeline Funnel ──
    const pipelineFunnel = [
      { stage: 'Nouveau', count: statusAnalysis.leads.NEW, value: leads.filter(l => l.status === 'NEW').reduce((s, l) => s + (l.dealValue || 0), 0) },
      { stage: 'Contacté', count: statusAnalysis.leads.CONTACTED, value: leads.filter(l => l.status === 'CONTACTED').reduce((s, l) => s + (l.dealValue || 0), 0) },
      { stage: 'Qualifié', count: statusAnalysis.leads.QUALIFIED, value: leads.filter(l => l.status === 'QUALIFIED').reduce((s, l) => s + (l.dealValue || 0), 0) },
      { stage: 'Perdu', count: statusAnalysis.leads.LOST, value: leads.filter(l => l.status === 'LOST').reduce((s, l) => s + (l.dealValue || 0), 0) },
    ];

    // ── Top Companies ──
    const companyMap: Record<number, { name: string; leads: number; revenue: number; deals: number }> = {};
    companies.forEach(c => { companyMap[c.id] = { name: c.name, leads: 0, revenue: 0, deals: 0 }; });
    leads.forEach(l => { if (l.companyId && companyMap[l.companyId]) companyMap[l.companyId].leads++; });
    deals.forEach(d => {
      if (d.lead?.companyId && companyMap[d.lead.companyId]) {
        companyMap[d.lead.companyId].deals++;
        if (d.status === 'WON') companyMap[d.lead.companyId].revenue += d.amount;
      }
    });
    const topCompanies = Object.values(companyMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

    // ── Activity Heatmap ── (day of week × hour)
    const heatmap: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    activities.forEach(a => {
      const d = new Date(a.createdAt);
      heatmap[d.getDay()][d.getHours()]++;
    });

    // ── Forecasts ──
    const avgMonthlyRevenue = totalRevenue / Math.max(monthlyGrowth.filter(m => m.revenue > 0).length, 1);
    const avgMonthlyDeals = wonDeals.length / Math.max(monthlyGrowth.filter(m => m.won > 0).length, 1);
    const forecast = {
      projectedRevenue: Math.round(avgMonthlyRevenue * 12),
      projectedDeals: Math.round(avgMonthlyDeals * 12),
      avgDealSize: wonDeals.length > 0 ? Math.round(totalRevenue / wonDeals.length) : 0,
      avgCycleTime: 'N/A',
    };

    // ── Industry Analysis ──
    const industryMap: Record<string, number> = {};
    companies.forEach(c => { industryMap[c.companyIndustry] = (industryMap[c.companyIndustry] || 0) + 1; });
    const industryAnalysis = Object.entries(industryMap).map(([label, value]) => ({ label, value }));

    return {
      globalStats,
      monthlyGrowth,
      statusAnalysis,
      industryAnalysis,
      repPerformance,
      pipelineFunnel,
      topCompanies,
      heatmap,
      forecast,
    };
  }

  // ─── REP: Personal Dashboard ──────────────────────────────────────────
  async getRepDashboard(userId: number, query: { from?: string; to?: string }) {
    const dateFilter = this.buildDateFilter(query.from, query.to);

    const [leads, deals, tasks, activities, notes, tickets] = await Promise.all([
      this.prisma.lead.findMany({ where: { userId, isDeleted: false, createdAt: dateFilter }, include: { leadScore: true } }),
      this.prisma.deal.findMany({ where: { userId, createdAt: dateFilter } }),
      this.prisma.task.findMany({ where: { userId, createdAt: dateFilter } }),
      this.prisma.activity.findMany({ where: { userId, createdAt: dateFilter } }),
      this.prisma.note.findMany({ where: { userId, createdAt: dateFilter } }),
      this.prisma.ticket.findMany({ where: { userId, createdAt: dateFilter } }),
    ]);

    const wonDeals = deals.filter(d => d.status === 'WON');
    const qualifiedLeads = leads.filter(l => l.status === 'QUALIFIED');
    const lostLeads = leads.filter(l => l.status === 'LOST');
    const closedCount = qualifiedLeads.length + lostLeads.length;
    const revenue = wonDeals.reduce((s, d) => s + d.amount, 0);
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

    const stats = {
      assignedLeads: leads.length,
      convertedLeads: qualifiedLeads.length,
      lostLeads: lostLeads.length,
      dealsWon: wonDeals.length,
      dealsTotal: deals.length,
      revenue,
      conversionRate: closedCount > 0 ? Math.round((qualifiedLeads.length / closedCount) * 1000) / 10 : 0,
      completedTasks: completedTasks.length,
      totalTasks: tasks.length,
      totalActivities: activities.length,
      totalNotes: notes.length,
      totalTickets: tickets.length,
      pipelineValue: deals.filter(d => !['WON', 'LOST', 'CLOSED'].includes(d.status)).reduce((s, d) => s + d.amount, 0),
    };

    // Monthly productivity
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthlyProductivity = monthNames.map((month, idx) => ({
      month,
      leads: leads.filter(l => new Date(l.createdAt).getMonth() === idx).length,
      activities: activities.filter(a => new Date(a.createdAt).getMonth() === idx).length,
      tasks: completedTasks.filter(t => new Date(t.createdAt).getMonth() === idx).length,
      revenue: wonDeals.filter(d => new Date(d.createdAt).getMonth() === idx).reduce((s, d) => s + d.amount, 0),
    }));

    // Pipeline status
    const pipelineStatus = [
      { stage: 'Nouveau', count: leads.filter(l => l.status === 'NEW').length },
      { stage: 'Contacté', count: leads.filter(l => l.status === 'CONTACTED').length },
      { stage: 'Qualifié', count: leads.filter(l => l.status === 'QUALIFIED').length },
      { stage: 'Perdu', count: leads.filter(l => l.status === 'LOST').length },
    ];

    // Monthly objectives (targets are estimates based on averages)
    const avgLeadsPerMonth = leads.length / 12;
    const objectives = {
      leadsTarget: Math.max(Math.ceil(avgLeadsPerMonth * 1.2), 5),
      leadsActual: leads.filter(l => new Date(l.createdAt).getMonth() === new Date().getMonth()).length,
      tasksTarget: Math.max(Math.ceil(tasks.length / 12 * 1.2), 10),
      tasksActual: completedTasks.filter(t => new Date(t.createdAt).getMonth() === new Date().getMonth()).length,
      revenueTarget: Math.max(Math.ceil(revenue / 12 * 1.2), 1000),
      revenueActual: wonDeals.filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth()).reduce((s, d) => s + d.amount, 0),
    };

    return { stats, monthlyProductivity, pipelineStatus, objectives };
  }

  // ─── Company Analytics ────────────────────────────────────────────────
  async getCompanyAnalytics(companyId: number) {
    const [leads, contacts, deals, activities] = await Promise.all([
      this.prisma.lead.findMany({ where: { companyId, isDeleted: false }, include: { leadScore: true } }),
      this.prisma.contact.findMany({ where: { companyId } }),
      this.prisma.deal.findMany({ where: { lead: { companyId } } }),
      this.prisma.activity.findMany({ where: { entity: { in: ['company', 'Company'] }, entityId: companyId } }),
    ]);

    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    const wonDeals = deals.filter(d => d.status === 'WON');
    const qualifiedLeads = leads.filter(l => l.status === 'QUALIFIED');
    const closedLeads = leads.filter(l => ['QUALIFIED', 'LOST'].includes(l.status));

    return {
      totalLeads: leads.length,
      totalContacts: contacts.length,
      totalDeals: deals.length,
      revenue: wonDeals.reduce((s, d) => s + d.amount, 0),
      pipelineValue: deals.filter(d => !['WON', 'LOST', 'CLOSED'].includes(d.status)).reduce((s, d) => s + d.amount, 0),
      conversionRate: closedLeads.length > 0 ? Math.round((qualifiedLeads.length / closedLeads.length) * 1000) / 10 : 0,
      recentActivities: activities.slice(-5),
      dealsLost: deals.filter(d => d.status === 'LOST').length,
      history: monthNames.map((month, idx) => ({
        month,
        revenue: wonDeals.filter(d => new Date(d.createdAt).getMonth() === idx).reduce((s, d) => s + d.amount, 0),
        activities: activities.filter(a => new Date(a.createdAt).getMonth() === idx).length,
      }))
    };
  }

  // ─── Contact Analytics ────────────────────────────────────────────────
  async getContactAnalytics(contactId: number) {
    const [emails, tickets, leadContacts, activities] = await Promise.all([
      this.prisma.email.findMany({ where: { contactId }, orderBy: { createdAt: 'desc' } }),
      this.prisma.ticket.findMany({ where: { contactId } }),
      this.prisma.leadContact.findMany({ where: { contactId }, include: { lead: true } }),
      this.prisma.activity.findMany({ where: { entity: { in: ['contact', 'Contact'] }, entityId: contactId }, orderBy: { createdAt: 'desc' } }),
    ]);

    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    const totalInteractions = emails.length + activities.length;
    const lastEmail = emails[0];

    return {
      totalInteractions,
      totalEmails: emails.length,
      totalTickets: tickets.length,
      associatedLeads: leadContacts.length,
      lastExchange: lastEmail?.createdAt || null,
      recentActivities: activities.slice(0, 5),
      engagementLevel: totalInteractions > 20 ? 'High' : totalInteractions > 5 ? 'Medium' : 'Low',
      history: monthNames.map((month, idx) => ({
        month,
        value: emails.filter(e => new Date(e.createdAt).getMonth() === idx).length + 
               activities.filter(a => new Date(a.createdAt).getMonth() === idx).length,
      }))
    };
  }

  // ─── Lead Analytics ───────────────────────────────────────────────────
  async getLeadAnalytics(leadId: number) {
    const [lead, notes, tasks, tickets, activities, emails] = await Promise.all([
      this.prisma.lead.findUnique({ where: { id: leadId }, include: { leadScore: true, company: true, pipeline: true } }),
      this.prisma.note.findMany({ where: { leadId } }),
      this.prisma.task.findMany({ where: { leadId } }),
      this.prisma.ticket.findMany({ where: { leadId } }),
      this.prisma.activity.findMany({ where: { entity: { in: ['lead', 'Lead'] }, entityId: leadId }, orderBy: { createdAt: 'desc' } }),
      this.prisma.email.findMany({ where: { leadId }, orderBy: { createdAt: 'desc' } }),
    ]);

    if (!lead) return null;

    // ── Lead History (for curves) ──
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYear = new Date().getFullYear();
    
    const history = monthNames.map((month, idx) => {
      return {
        month,
        activities: activities.filter(a => new Date(a.createdAt).getMonth() === idx).length,
        emails: emails.filter(e => new Date(e.createdAt).getMonth() === idx).length,
        score: lead.leadScore?.score ? Math.max(0, lead.leadScore.score - (11 - idx) * 2) : 0 
      };
    });

    const timeInPipeline = Math.floor((new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const lastActivity = activities[0] || emails[0] || null;

    return {
      score: lead.leadScore?.score || 0,
      probability: lead.leadScore?.probability || lead.probability || 0,
      temperature: lead.leadScore?.temperature || 'Cold',
      estimatedValue: lead.dealValue || 0,
      timeInPipeline,
      lastActivity: lastActivity?.createdAt || lead.updatedAt,
      notesCount: notes.length,
      tasksCount: tasks.length,
      ticketsCount: tickets.length,
      emailsCount: emails.length,
      completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
      activitiesCount: activities.length,
      history,
    };
  }

  // ─── Keep original endpoints for backward compatibility ───────────────
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
    const deals = await this.prisma.deal.findMany();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames.map((month, idx) => ({
      month,
      value: deals.filter(d => d.status === 'WON' && new Date(d.createdAt).getMonth() === idx).reduce((s, d) => s + d.amount, 0),
    }));
  }

  async getPipelineData() {
    const pipelines = await this.prisma.pipeline.findMany({ include: { leads: true } });
    return pipelines.map(p => ({
      stage: p.name,
      value: p.leads.length * 10000
    }));
  }

  async getDealsData() {
    const deals = await this.prisma.deal.findMany();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames.map((month, idx) => {
      const mDeals = deals.filter(d => new Date(d.createdAt).getMonth() === idx);
      return {
        month,
        won: mDeals.filter(d => d.status === 'WON').length,
        lost: mDeals.filter(d => d.status === 'LOST').length,
        proposal: mDeals.filter(d => d.status === 'ACTIVE').length,
      };
    });
  }

  private buildDateFilter(from?: string, to?: string) {
    if (!from && !to) return undefined;
    const filter: any = {};
    if (from) filter.gte = new Date(from);
    if (to) filter.lte = new Date(to);
    return filter;
  }
}
