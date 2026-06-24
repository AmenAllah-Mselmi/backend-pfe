import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailsService {
  constructor(private readonly prisma: PrismaService,
    private readonly mailerService: MailerService
  ) { }
  async create(createEmailDto: CreateEmailDto) {
    try {
      let lead = null;
      let contact = null;
      if (createEmailDto.leadId) {
        lead = await this.prisma.lead.findUnique({
          where: { id: createEmailDto.leadId },
        });
        if (!lead) throw new Error(`Lead with id ${createEmailDto.leadId} not found`);
      }

      if (createEmailDto.contactId) {
        contact = await this.prisma.contact.findUnique({
          where: { id: createEmailDto.contactId },
        });
        if (!contact) throw new Error(`Contact with id ${createEmailDto.contactId} not found`);

      }

      const user = await this.prisma.user.findUnique({
        where: { id: createEmailDto.userId },
      });
      if (!user) {
        throw new Error(`User with id ${createEmailDto.userId} not found`);
      }
      try {
        await this.mailerService.sendMail({
          to: createEmailDto.to,
          from: user.email,
          subject: createEmailDto.subject,
          html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">CRM Notification</h2>
        <p>Hello ${createEmailDto.to || 'User'},</p>
        <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #2563eb;">
            <p>${createEmailDto.body}</p>
        </div>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 12px;">
            Sent from Your CRM System<br>
            © ${new Date().getFullYear()} All rights reserved.
        </p>
    </div>
  `
        });
      } catch (mailError) {
        console.error('Failed to send email via Mailtrap (rate limit or config issue):', mailError);
      }
      const emailData: any = {
        from: createEmailDto.from,
        to: createEmailDto.to,
        subject: createEmailDto.subject,
        body: createEmailDto.body,
        status: createEmailDto.status,
        emailType: createEmailDto.emailType,
        sentAt: createEmailDto.sentAt,
        user: { connect: { id: createEmailDto.userId } },
      };

      if (createEmailDto.leadId) emailData.lead = { connect: { id: createEmailDto.leadId } };
      if (createEmailDto.contactId) emailData.contact = { connect: { id: createEmailDto.contactId } };

      const email = await this.prisma.email.create({
        data: emailData,
      });

      if (lead) {
        await this.prisma.activity.create({
          data: {
            type: 'email_sent',
            title: 'Email Sent',
            description: `Sent email to Lead: ${lead.name}`,
            entity: 'lead',
            entityId: lead.id,
            userId: createEmailDto.userId,
            metadata: { entityName: lead.name }
          }
        });
      } else if (contact) {
        await this.prisma.activity.create({
          data: {
            type: 'email_sent',
            title: 'Email Sent',
            description: `Sent email to Contact: ${contact.name}`,
            entity: 'contact',
            entityId: contact.id,
            userId: createEmailDto.userId,
            metadata: { entityName: contact.name }
          }
        });
      }

      return email;
    } catch (error) {
      throw new Error(`Failed to create email: ${error}`);
    }
  }

  async findAll(contactId?: number, leadId?: number, userId?: number) {
    const where: any = {};
    if (contactId !== undefined) where.contactId = contactId;
    if (leadId !== undefined) where.leadId = leadId;
    if (userId !== undefined) where.userId = userId;
    return await this.prisma.email.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { sentAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const email = await this.prisma.email.findUnique({
      where: { id },
    });
    if (!email) {
      throw new Error(`Email with id ${id} not found`);
    }

    return email;
  }

  async update(id: number, updateEmailDto: UpdateEmailDto) {
    const email = await this.prisma.email.findUnique({
      where: { id },
    });
    if (!email) {
      throw new Error(`Email with id ${id} not found`);
    }
    return await this.prisma.email.update({
      where: { id },
      data: updateEmailDto,
    });
  }

  async remove(id: number) {
    const email = await this.prisma.email.findUnique({
      where: { id },
    });
    if (!email) {
      throw new Error(`Email with id ${id} not found`);
    }
    return await this.prisma.email.delete({
      where: { id },
    });
  }
}
