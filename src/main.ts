import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder().setTitle('CRM API')
    .setDescription('Documentation de l\'API de gestion CRM')
    .setVersion('1.0')
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('api-docs', app, document);
  app.use(cookieParser())
  app.enableCors(
    {
      origin: process.env.NODE_ENV === 'production' 
      ? ['https://votre-domaine.com', 'http://frontend.local'] // En production
      : ['http://localhost:3001', 'http://localhost:3000', 'http://frontend.local'], // En développement
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials:true
    }
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(3000,'0.0.0.0');
}
bootstrap();
