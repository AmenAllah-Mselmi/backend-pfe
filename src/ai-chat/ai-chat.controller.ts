import { Controller, Post, Body } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post()
  async handleChat(@Body() body: { question: string, userId?: number, role?: string }) {
    return this.aiChatService.handleChat(body.question, body.userId, body.role);
  }
}
