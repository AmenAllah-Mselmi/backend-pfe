import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiChatService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in the environment. AI Chat will not work properly.');
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async handleChat(question: string, userId?: number, role?: string) {
    if (!this.genAI) {
      throw new HttpException('AI service is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      // If user is a rep, only fetch their data. Admin fetches everything.
      const userFilter = (userId && role !== 'ADMIN') ? { userId } : {};

      // Gather context from database
      const [leadsCount, wonDealsCount, pipelines, recentLeads, tasks] = await Promise.all([
        this.prisma.lead.count({ where: userFilter }),
        this.prisma.deal.count({ where: { status: 'WON', ...userFilter } }),
        this.prisma.pipeline.findMany({ 
          where: userFilter,
          include: { leads: true } 
        }),
        this.prisma.lead.findMany({
          take: 10,
          where: userFilter,
          orderBy: { createdAt: 'desc' },
          select: { name: true, status: true, company: { select: { name: true } }, dealValue: true, email: true }
        }),
        this.prisma.task.findMany({
          take: 10,
          where: { status: { in: ['PENDING', 'IN_PROGRESS'] }, ...userFilter },
          select: { title: true, dueDate: true, status: true, lead: { select: { name: true } } }
        })
      ]);

      let contextStr = "Here is the current CRM database context:\n\n";
      
      contextStr += `### Global Stats\n`;
      contextStr += `- Total Leads: ${leadsCount}\n`;
      contextStr += `- Total Won Deals: ${wonDealsCount}\n\n`;
      
      contextStr += `### Pipelines Status\n`;
      for (const p of pipelines) {
        contextStr += `- Pipeline "${p.name}" (Stage: ${p.stage}) has ${p.leads.length} leads.\n`;
      }
      contextStr += `\n`;
      
      contextStr += `### Recent Leads\n`;
      for (const l of recentLeads) {
        contextStr += `- Name: ${l.name}, Status: ${l.status}, Company: ${l.company?.name || 'Unknown'}, Deal Value: $${l.dealValue || 0}, Email: ${l.email}\n`;
      }
      contextStr += `\n`;

      contextStr += `### Pending/In-Progress Tasks\n`;
      for (const t of tasks) {
        contextStr += `- Task: "${t.title}", Status: ${t.status}, Due: ${t.dueDate.toISOString().split('T')[0]}, Related Lead: ${t.lead?.name || 'Unknown'}\n`;
      }
      contextStr += `\n`;

      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `You are a helpful and intelligent CRM assistant. You answer user questions in French. 
The user is asking a question about their CRM data. Use the following real-time database context to answer the question accurately.
If the database context does not contain the specific information the user is asking for, state that you don't have that information in your current context instead of making up facts.

Context:
${contextStr}

User Question: ${question}

Instructions:
1. Answer in French.
2. Be concise but helpful.
3. If the question is generic (e.g. "hi"), greet them and offer to help with their leads, deals, or tasks.
4. Base your specific answers ONLY on the provided context.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return { response: text };
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new HttpException('Failed to generate AI response', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
