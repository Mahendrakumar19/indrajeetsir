import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { AuthService } from './auth.service.js';
import { MailService } from './mail.service.js';
import { RazorpayService } from './razorpay.service.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthService, MailService, RazorpayService],
})
export class AppModule {}
