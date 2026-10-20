import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { AuthService } from './auth.service.js';
import { MailService } from './mail.service.js';
import { RazorpayService } from './razorpay.service.js';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 60 seconds window
        limit: 120, // Max 120 requests per minute across general routes per IP
      },
      {
        name: 'auth',
        ttl: 60000, // 60 seconds window
        limit: 10, // Max 10 requests per minute on sensitive auth routes per IP
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    MailService,
    RazorpayService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

