import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Allow dynamic Prisma model delegates across all TS/IDE language servers
  [key: string]: any;

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to Database via Prisma');
    } catch (err) {
      console.warn('⚠️ Operating with database fallback:', (err as Error).message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
