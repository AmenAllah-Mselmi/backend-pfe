import { Module } from '@nestjs/common';
import { LeadContactsService } from './lead-contacts.service';
import { LeadContactsController } from './lead-contacts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LeadContactsController],
  providers: [LeadContactsService],
  imports: [PrismaModule],
})
export class LeadContactsModule {}
