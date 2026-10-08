import { Injectable } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';

export interface StudentOnboardingMailParams {
  email: string;
  name: string;
  passwordPlain: string;
  courseTitle: string;
  appDownloadUrl?: string;
}

@Injectable()
export class MailService {
  private transporter: Transporter | null = null;
  private readonly appDownloadUrl: string;

  constructor() {
    this.appDownloadUrl = process.env.APP_DOWNLOAD_URL || 'https://indrajeetsir.com/download-app';

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        console.log('✅ MailService: SMTP Transporter initialized');
      } catch (err) {
        console.warn('⚠️ MailService: Failed to initialize SMTP transporter:', (err as Error).message);
      }
    }
  }

  async sendStudentOnboardingEmail(params: StudentOnboardingMailParams): Promise<{ success: boolean; preview?: string }> {
    const downloadLink = params.appDownloadUrl || this.appDownloadUrl;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 0; font-size: 13px; color: #94a3b8; }
          .body { padding: 32px 28px; }
          .welcome { font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
          .card { background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .card-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.6px; margin-bottom: 12px; }
          .cred-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .cred-label { color: #64748b; }
          .cred-value { font-weight: 700; color: #0f172a; font-family: monospace; font-size: 15px; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn { background: #2563eb; color: #ffffff !important; padding: 14px 32px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
          .steps { background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 24px; font-size: 13px; line-height: 1.6; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🇮🇳 Indrajeet Sir IAS Mentorship</h1>
            <p>1:1 Live Classroom & Mentorship Portal</p>
          </div>
          <div class="body">
            <p class="welcome">Dear <strong>${params.name}</strong>,<br><br>Welcome to the <strong>${params.courseTitle}</strong> program under the direct guidance of <strong>Indrajeet Sir</strong>. Your mentorship enrollment is now active!</p>
            
            <div class="card">
              <div class="card-title">Your Mobile Classroom Credentials</div>
              <div class="cred-row">
                <span class="cred-label">Login Email:</span>
                <span class="cred-value">${params.email}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Password:</span>
                <span class="cred-value">${params.passwordPlain}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Enrolled Program:</span>
                <span class="cred-value">${params.courseTitle}</span>
              </div>
            </div>

            <div class="steps">
              <strong>How to Attend Your Live Sessions:</strong><br>
              1. Download the student application using the button below.<br>
              2. Log in using your email and password above.<br>
              3. View your today's scheduled live classes and 1:1 mentorship slots.<br>
              4. You will receive an automated alert <strong>10 minutes</strong> before class begins to join the Google Meet room.
            </div>

            <div class="btn-container">
              <a href="${downloadLink}" class="btn">📱 Download Student App</a>
            </div>

            <p style="font-size: 12.5px; color: #64748b; text-align: center;">Need assistance? Reply directly to this email or message on the mentorship portal.</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Indrajeet Sir IAS Mentorship Academy. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. If real SMTP is active, dispatch email
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || '"Indrajeet Sir Academy" <info@indrajeetsir.com>',
          to: params.email,
          subject: `🎓 Your Login Credentials & App Link — ${params.courseTitle}`,
          text: `Dear ${params.name},\n\nWelcome to ${params.courseTitle} with Indrajeet Sir.\n\nYour Login Credentials:\nEmail: ${params.email}\nPassword: ${params.passwordPlain}\n\nDownload Student Mobile App:\n${downloadLink}\n\nIndrajeet Sir IAS Mentorship`,
          html: htmlContent,
        });
        console.log(`✉️ Email dispatched successfully to: ${params.email}`);
        return { success: true };
      } catch (err) {
        console.error('Failed to send mail via SMTP:', err);
      }
    }

    // 2. Console fallback / log
    console.log('\n================== [AUTOMATED ONBOARDING EMAIL] ==================');
    console.log(`TO:           ${params.email} (${params.name})`);
    console.log(`SUBJECT:      Your Login Credentials & App Link — ${params.courseTitle}`);
    console.log(`PASSWORD:     ${params.passwordPlain}`);
    console.log(`APP DOWNLOAD: ${downloadLink}`);
    console.log('===================================================================\n');

    return { success: true };
  }
}
