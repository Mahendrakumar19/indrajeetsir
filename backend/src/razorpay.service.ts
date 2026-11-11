import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import Razorpay from 'razorpay';
import crypto from 'crypto';

@Injectable()
export class RazorpayService {
  private razorpay: any = null;
  public readonly keyId: string;
  private readonly keySecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || '';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    if (this.keyId && this.keySecret) {
      try {
        this.razorpay = new Razorpay({
          key_id: this.keyId,
          key_secret: this.keySecret,
        });
        console.log('✅ RazorpayService: Initialized successfully with credentials');
      } catch (err) {
        console.error('❌ RazorpayService: Failed to initialize Razorpay instance:', (err as Error).message);
      }
    } else {
      console.warn('⚠️ RazorpayService: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment');
    }
  }

  async createOrder(params: {
    amountInRupees?: number;
    amountInPaise?: number;
    courseId?: string;
    studentEmail?: string;
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
  }): Promise<{ orderId: string; amount: number; currency: string; keyId: string }> {
    let amountInPaise: number;
    if (typeof params.amountInPaise === 'number') {
      amountInPaise = Math.round(params.amountInPaise);
    } else if (typeof params.amountInRupees === 'number') {
      amountInPaise = Math.round(params.amountInRupees * 100);
    } else {
      throw new BadRequestException('Amount is required to create order.');
    }

    if (amountInPaise < 100) {
      throw new BadRequestException('Amount must be at least 100 paise (₹1.00).');
    }

    const currency = params.currency || 'INR';
    const receipt = params.receipt || `rcpt_${Date.now()}`;
    const notes = {
      ...(params.courseId ? { courseId: params.courseId } : {}),
      ...(params.studentEmail ? { studentEmail: params.studentEmail } : {}),
      ...(params.notes || {}),
    };

    if (!this.razorpay) {
      if (!this.keyId || !this.keySecret) {
        throw new UnauthorizedException('Razorpay credentials are not configured on the server.');
      }
      throw new InternalServerErrorException('Razorpay client is not initialized.');
    }

    try {
      const order = await this.razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt,
        notes,
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: this.keyId,
      };
    } catch (err: any) {
      console.error('❌ Razorpay API orders.create failed:', JSON.stringify(err, null, 2), err);
      const statusCode = err?.statusCode || err?.status;
      const errorMsg = err?.error?.description || err?.message || JSON.stringify(err?.error || err);
      if (statusCode === 401) {
        throw new UnauthorizedException(`Razorpay auth failed (401): ${errorMsg}`);
      }
      if (statusCode === 403) {
        throw new InternalServerErrorException(`Razorpay access forbidden (403): ${errorMsg}. Check account activation & KYC on Razorpay Dashboard.`);
      }
      throw new InternalServerErrorException(`Razorpay order creation failed: ${errorMsg}`);
    }
  }

  verifySignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    if (!params.orderId || !params.paymentId || !params.signature) {
      return false;
    }

    if (!this.keySecret) {
      console.error('❌ RazorpayService: Cannot verify signature, RAZORPAY_KEY_SECRET is not configured.');
      return false;
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${params.orderId}|${params.paymentId}`)
        .digest('hex');

      return generatedSignature === params.signature;
    } catch (err) {
      console.error('❌ Error calculating HMAC signature:', err);
      return false;
    }
  }
}
