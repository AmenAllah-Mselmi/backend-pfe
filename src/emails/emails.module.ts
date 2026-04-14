import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
@Module({
  controllers: [EmailsController],
  providers: [EmailsService],
  imports: [PrismaModule,
   ConfigModule.forRoot({ isGlobal: true }), 
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'), // e.g., sandbox.smtp.mailtrap.io
          port: configService.get<number>('SMTP_PORT'), // e.g., 2525
          secure: false, // true for 465, false for other ports
          auth: {
            user: configService.get<string>('SMTP_USERNAME'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
      }),
    }),

  ],
})
export class EmailsModule {}
