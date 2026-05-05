import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { ContactsModule } from './contacts/contacts.module';
import { CompaniesModule } from './companies/companies.module';
import { PipelinesModule } from './pipelines/pipelines.module';
import { ActivitiesModule } from './activities/activities.module';
import { CsvImportModule } from './csv-import/csv-import.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';
import { DealsModule } from './deals/deals.module';
import { EmailsModule } from './emails/emails.module';
import { TicketsModule } from './tickets/tickets.module';
import { LeadContactsModule } from './lead-contacts/lead-contacts.module';
import { LeadScoringModule } from './modules/lead-scoring/lead-scoring.module';
import { DatesModule } from './dates/dates.module';
import { PipelineDatesModule } from './pipeline-dates/pipeline-dates.module';
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule } from '@nestjs/config';
import { AiEmailModule } from './ai-email/ai-email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LeadsModule, 
    ContactsModule, 
    CompaniesModule, 
    PipelinesModule,  
    ActivitiesModule, 
    CsvImportModule, 
    UsersModule, 
    TasksModule, 
    NotesModule, 
    DealsModule, 
    EmailsModule, 
    TicketsModule, 
    LeadContactsModule, 
    LeadScoringModule, 
    DatesModule, 
    PipelineDatesModule, 
    MessagesModule, 
    ChatsModule, 
    NotificationsModule, 
    AnalyticsModule, 
    AiEmailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
