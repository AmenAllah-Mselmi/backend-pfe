import { Controller, Get, Post, Param } from '@nestjs/common';
import { LeadScoringService } from './lead-scoring.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Lead Scoring')
@Controller('lead-scoring')
export class LeadScoringController {
  constructor(private readonly leadScoringService: LeadScoringService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get current score or recalculate for a specific lead' })
  async getScore(@Param('id') leadId: string) {
    return this.leadScoringService.getLeadScore(+leadId);
  }

  @Post('recalculate-all')
  @ApiOperation({ summary: 'Recalculate scores for all leads in batch' })
  async recalculateAll() {
    return this.leadScoringService.recalculateAll();
  }
}
