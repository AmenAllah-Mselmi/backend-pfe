import { Controller, Post, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AiEmailService } from './ai-email.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AI Email')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai-email')
export class AiEmailController {
  constructor(private readonly aiEmailService: AiEmailService) {}

  @Post('generate/:leadId')
  @ApiOperation({ summary: 'Generate a personalized AI email for a specific lead' })
  @ApiResponse({ status: 200, description: 'Email successfully generated' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async generateEmail(@Param('leadId', ParseIntPipe) leadId: number) {
    return this.aiEmailService.generateEmail(leadId);
  }
}
