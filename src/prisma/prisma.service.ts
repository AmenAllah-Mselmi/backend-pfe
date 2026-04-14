import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // ✅ Prisma 6 classic binary engine works out of the box
    super({});
  }

  async onModuleInit() {
    // Connect when NestJS module initializes
    await this.$connect();
  }

  async onModuleDestroy() {
    // Disconnect when NestJS shuts down
    await this.$disconnect();
  }
}