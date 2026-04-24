import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { InspectionRequest } from '../inspection-requests/entities/inspection-request.entity';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
  }

  // Normalise Nigerian phone numbers to wa.me format (no leading + or 0)
  private toWhatsAppNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('234')) return digits;
    if (digits.startsWith('0')) return `234${digits.slice(1)}`;
    return `234${digits}`;
  }

  private formatNaira(amount: number | string): string {
    return `₦${Number(amount).toLocaleString('en-NG')}`;
  }

  async sendNewRequestNotification(
    request: InspectionRequest,
  ): Promise<void> {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    const waNumber = this.toWhatsAppNumber(request.buyerWhatsapp);
    const waLink = `https://wa.me/${waNumber}`;

    const html = this.buildEmailHtml(request, waLink);

    const { error } = await this.resend.emails.send({
      from: 'BuyPadi Notifications <onboarding@resend.dev>',
      to: adminEmail,
      subject: `New Inspection Request — ${request.orderId}`,
      html,
    });

    if (error) {
      this.logger.error(`Failed to send notification email: ${error.message}`);
    } else {
      this.logger.log(`Notification sent to ${adminEmail} for ${request.orderId}`);
    }
  }

  private buildEmailHtml(request: InspectionRequest, waLink: string): string {
    const { orderId, itemPrice, productLink, comments, screenshotUrl,
            buyerFullName, buyerEmail, buyerWhatsapp,
            sellerName, sellerPhone, sellerAddress } = request;

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#64748B;white-space:nowrap;vertical-align:top;width:140px;">${label}</td>
        <td style="padding:10px 16px;font-size:13px;color:#1E293B;font-weight:600;word-break:break-word;">${value || '—'}</td>
      </tr>`;

    const section = (title: string, rows: string) => `
      <div style="margin-bottom:24px;">
        <div style="background:#063B27;padding:10px 16px;border-radius:8px 8px 0 0;">
          <p style="margin:0;font-size:12px;font-weight:700;color:#8DC342;text-transform:uppercase;letter-spacing:0.08em;">${title}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:0 0 8px 8px;overflow:hidden;">
          <tbody>${rows}</tbody>
        </table>
      </div>`;

    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Header -->
        <tr><td style="background:#063B27;border-radius:12px 12px 0 0;padding:32px 32px 24px;">
          <p style="margin:0 0 4px;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">BuyPadi</p>
          <p style="margin:0;font-size:13px;color:#8DC342;font-weight:600;">Inspection Request Notification</p>
        </td></tr>

        <!-- Order ID banner -->
        <tr><td style="background:#8DC342;padding:14px 32px;">
          <p style="margin:0;font-size:13px;color:#063B27;font-weight:700;">
            New request received &nbsp;·&nbsp;
            <span style="background:#063B27;color:#8DC342;padding:2px 10px;border-radius:20px;font-size:12px;">${orderId}</span>
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#F5F7FA;padding:28px 32px;">

          ${section('Item Information',
            row('Product Link', productLink
              ? `<a href="${productLink}" style="color:#063B27;">${productLink}</a>`
              : '—') +
            row('Item Price', this.formatNaira(itemPrice)) +
            row('Comments', comments || '—') +
            row('Screenshot', screenshotUrl
              ? `<a href="${screenshotUrl}" style="color:#063B27;">View screenshot</a>`
              : '—')
          )}

          ${section('Buyer Information',
            row('Full Name', buyerFullName) +
            row('Email', `<a href="mailto:${buyerEmail}" style="color:#063B27;">${buyerEmail}</a>`) +
            row('WhatsApp', buyerWhatsapp)
          )}

          ${section('Seller Information',
            row('Name / Store', sellerName) +
            row('Phone', sellerPhone) +
            row('Address', sellerAddress)
          )}

          <!-- WhatsApp CTA -->
          <div style="text-align:center;margin-top:8px;">
            <a href="${waLink}"
               style="display:inline-block;background:#25D366;color:#ffffff;font-size:15px;font-weight:700;
                      padding:14px 36px;border-radius:50px;text-decoration:none;letter-spacing:0.2px;">
              💬 Message Client on WhatsApp
            </a>
            <p style="margin:12px 0 0;font-size:12px;color:#94A3B8;">
              Opens WhatsApp chat with ${buyerFullName} (${buyerWhatsapp})
            </p>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#063B27;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#ffffff;opacity:0.5;">
            BuyPadi.ng &nbsp;·&nbsp; Secure Asset Custodianship &nbsp;·&nbsp; Nigeria's #1 Verification Partner
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
  }
}
