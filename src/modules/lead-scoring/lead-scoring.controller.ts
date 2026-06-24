import { Controller, Get, Post, Param } from '@nestjs/common';
import { LeadScoringService } from './lead-scoring.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Lead Scoring')
@Controller('lead-scoring')
export class LeadScoringController {
  constructor(private readonly leadScoringService: LeadScoringService) {}

  @Get(':id/saved')
  @ApiOperation({ summary: 'Read saved score from DB without recalculating' })
  async getSavedScore(@Param('id') leadId: string) {
    return this.leadScoringService.getSavedScore(+leadId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Force recalculate score for a specific lead' })
  async getScore(@Param('id') leadId: string) {
    return this.leadScoringService.getLeadScore(+leadId);
  }

  @Post('recalculate-all')
  @ApiOperation({ summary: 'Recalculate scores for all leads in batch' })
  async recalculateAll() {
    return this.leadScoringService.recalculateAll();
  }
}
