import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiEmailService {
  private readonly logger = new Logger(AiEmailService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.logger.log('Initializing Gemini AI with provided API Key...');
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-1.5-flash which is widely available
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  async generateEmail(leadId: number) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        company: true,
        notes: true,
        tasks: true,
        emails: true,
        leadScore: true,
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    // Attempt AI Generation if API key is present
    if (this.model) {
      try {
        return await this.generateWithAI(lead);
      } catch (error) {
        this.logger.error('AI Generation failed, falling back to rules engine', error);
      }
    }

    // Fallback to Rules Engine (Legacy)
    return this.generateWithRules(lead);
  }

  private async generateWithAI(lead: any) {
    const { company, notes, tasks, emails, leadScore, status } = lead;
    
    // Prepare context for the AI
    const mlReasons = leadScore?.reasons ? JSON.parse(leadScore.reasons) : [];
    const notesSummary = notes.slice(-3).map(n => n.content).join('; ');
    const lastEmailSubject = emails.length > 0 ? emails[emails.length - 1].subject : 'None';
    
    const prompt = `
      You are an expert Sales AI Agent. Generate a personalized sales email for the following lead:
      
      Lead Name: ${lead.name}
      Company: ${company?.name || 'Unknown'}
      Industry: ${company?.companyIndustry || 'Unknown'}
      Pipeline Stage: ${status}
      Lead Score: ${leadScore?.score || 0}/100 (${leadScore?.temperature || 'Cold'})
      
      ML Insights (Reasons for score):
      ${mlReasons.map(r => `- ${r}`).join('\n')}
      
      Recent Activity/Notes:
      ${notesSummary || 'No recent notes.'}
      
      Last Interaction: ${lastEmailSubject}
      
      Requirements:
      1. Tone should match the lead temperature (${leadScore?.temperature || 'Cold'}).
      2. Mention at least one ML Insight or specific detail from the notes to show personalization.
      3. Keep it concise (max 150 words).
      4. Detect the language from the notes. If notes are in French, write in French. If in Arabic, write in Arabic. Default to English.
      5. Output MUST be in valid JSON format with the following keys:
         - subject: A compelling subject line
         - body: The email body text (use \n for line breaks)
         - cta: The specific call to action used
         - tone: The tone detected/used
         - language: The language used
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Robust JSON extraction
    let jsonStr = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const aiOutput = JSON.parse(jsonStr);

    return {
      ...aiOutput,
      isAiGenerated: true,
      reason: [
        `Generated using Gemini 1.5 AI model.`,
        ...mlReasons.slice(0, 2),
        `Context depth: ${notes.length} notes analyzed.`
      ]
    };
  }

  private generateWithRules(lead: any) {
    const { company, notes, tasks, emails, leadScore, status } = lead;

    // Extract basic information
    const score = leadScore?.score || 0;
    const temperature = leadScore?.temperature || 'Cold';
    const pipelineStage = status || 'NEW';
    const companyName = company?.name || 'your company';
    const industry = company?.companyIndustry || 'your industry';
    
    // Calculate last activity date
    let lastActivityDate = lead.updatedAt;
    if (tasks.length > 0) {
      const latestTask = tasks.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
      if (latestTask.updatedAt > lastActivityDate) lastActivityDate = latestTask.updatedAt;
    }
    
    const daysSinceLastActivity = Math.floor((new Date().getTime() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24));
    const isFollowUp = daysSinceLastActivity >= 14;

    // Detect Language based on notes
    let language = 'English';
    const allNotesText = notes.map(n => n.content).join(' ').toLowerCase();
    if (allNotesText.match(/[a-zA-Z\u00C0-\u017F]*\b(bonjour|merci|oui|non|projet|entreprise)\b[a-zA-Z\u00C0-\u017F]*/i)) {
      language = 'French';
    }

    let tone = 'Professional';
    let cta = 'Would you be open to a brief call next week?';
    
    if (temperature === 'Hot') {
      tone = 'Urgent and Enthusiastic';
      cta = 'Can we finalize the details on a quick call tomorrow?';
    }

    let subject = `Enhancing operations at ${companyName}`;
    let body = `Hi ${lead.name},\n\nI hope this email finds you well. I noticed that ${companyName} is making strides in the ${industry} space.\n\n${cta}\n\nBest regards,\n[Your Name]`;

    return {
      subject,
      body,
      cta,
      tone,
      language,
      isAiGenerated: false,
      reason: [
        `Static template used (No API Key found).`,
        `Score is ${score} (${temperature}).`,
        `Language detected: ${language}`
      ]
    };
  }
}
