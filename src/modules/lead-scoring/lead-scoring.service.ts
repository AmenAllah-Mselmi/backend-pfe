import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LeadScoringService {
  private readonly logger = new Logger(LeadScoringService.name);

  private readonly mlServiceUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {
    this.mlServiceUrl = this.config.get<string>('SCORING_AI_URL') || 'http://localhost:8000/predict-score';
  }

  /**
   * Version 1: MVP - Rules Engine
   */
  public async calculateMvpScore(leadId: number) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        notes: true,
        tasks: true,
        emails: true,
      }
    });

    if (!lead) return null;

    let score = 0;
    const reasons: string[] = [];

    // Demo Override for demo/testing purposes
    if (lead.name && lead.name.toLowerCase().includes('demo')) {
      score = 95;
      reasons.push('Demo Boost Mode active (+95)');
      return { score, probability: 0.95, temperature: 'Hot', reasons };
    }

    // Deal Value Logic
    if (lead.dealValue && lead.dealValue > 5000) {
      score += 25;
      reasons.push('High deal value (> 5000)');
    }

    // Example logic using notes/emails as substitutes for calls/meetings if schema lacks direct counts
    const emailsCount = lead.emails?.length || 0;
    const notesCount = lead.notes?.length || 0;

    if (emailsCount > 3) {
      score += 15;
      reasons.push('High email activity');
    }
    
    if (notesCount > 1) {
      score += 20;
      reasons.push('Multiple meetings/notes recorded');
    }

    // In a real app we derive 'last activity < 7 days' from updated/activity dates
    const msInDay = 1000 * 60 * 60 * 24;
    const daysSinceLastUpdate = Math.floor((new Date().getTime() - new Date(lead.updatedAt).getTime()) / msInDay);
    if (daysSinceLastUpdate < 7) {
      score += 20;
      reasons.push('Recent activity');
    }

    // Assume some stages are close to winning
    if (['NEGOCIATION', 'PROPOSITION'].includes(lead.status as string) || lead.probability > 50) {
      score += 15;
      reasons.push('Advanced stage in pipeline');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    const probability = score / 100;
    let temperature = 'Cold';
    if (score >= 70) temperature = 'Hot';
    else if (score >= 40) temperature = 'Warm';

    return { score, probability, temperature, reasons };
  }

  /**
   * Version 2: Advanced ML
   */
  public async callMlService(leadId: number) {
    try {
      const lead = await this.prisma.lead.findUnique({ 
        where: { id: leadId },
        include: {
          emails: true,
          notes: true,
          tasks: true,
          company: true,
        }
      });
      if (!lead) return null;

      // Demo Override - Force fallback to MVP scoring for demo leads to apply the custom high score
      if (lead.name && lead.name.toLowerCase().includes('demo')) {
        return null;
      }

      // Extract basic features
      const payload = {
        deal_value: lead.dealValue || 0,
        calls: lead.tasks?.length || 0, // Mocks based on tasks
        emails: lead.emails?.length || 0, 
        meetings: lead.notes?.length || 0, // Mocks based on notes
        stage: lead.status || 'NEW',
        industry: lead.company?.companyIndustry || "TECHNOLOGY", 
        company_size: lead.company?.companySize || "MEDIUM"
      };

      const response = await fetch(this.mlServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const mlData = await response.json();
        return mlData;
      }
    } catch (e) {
      this.logger.warn(`ML Service not accessible for lead ${leadId}. Falling back to MVP rules.`);
    }
    return null;
  }

  /**
   * Final Score Logic (Attempts ML, forwards to MVP if fails)
   */
  public async calculateScore(leadId: number) {
    let result = await this.callMlService(leadId);
    if (!result) {
      result = await this.calculateMvpScore(leadId);
    }
    if (!result) throw new Error('Lead not found');

    const recommendedNextAction = result.temperature === 'Hot' ? 'Call now' : 
                                 result.temperature === 'Warm' ? 'Schedule demo' : 
                                 'Send follow-up email';
    result.reasons.push(`Action: ${recommendedNextAction}`);

    // Upsert LeadScore table
    await this.prisma.leadScore.upsert({
      where: { leadId },
      update: {
        score: result.score,
        probability: result.probability,
        temperature: result.temperature,
        reasons: JSON.stringify(result.reasons),
        calculatedAt: new Date()
      },
      create: {
        leadId,
        score: result.score,
        probability: result.probability,
        temperature: result.temperature,
        reasons: JSON.stringify(result.reasons),
        calculatedAt: new Date()
      }
    });

    return { ...result, nextAction: recommendedNextAction };
  }

  /**
   * Read saved score from DB without recalculating.
   * Returns null if no score exists yet.
   */
  public async getSavedScore(leadId: number) {
    const saved = await this.prisma.leadScore.findUnique({
      where: { leadId }
    });
    return saved;
  }

  /**
   * Force recalculate (used by Reload AI Analysis button)
   */
  public async getLeadScore(leadId: number) {
    return this.calculateScore(leadId);
  }

  public async recalculateAll() {
    this.logger.log('Starting Batch Re-Calculation of Lead Scores...');
    const leads = await this.prisma.lead.findMany({ select: { id: true } });
    let count = 0;
    for (const lead of leads) {
      await this.calculateScore(lead.id);
      count++;
    }
    this.logger.log(`Recalculated scores for ${count} leads.`);
    return { success: true, recalculated: count };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyScoreRecalculation() {
    this.logger.log('Running scheduled daily lead score recalculation (Cron)...');
    await this.recalculateAll();
  }
}
