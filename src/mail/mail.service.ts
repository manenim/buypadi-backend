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

  private formatNaira(amount: number | string): string {
    return `₦${Number(amount).toLocaleString('en-NG')}`;
  }

  async sendNewRequestNotification(request: InspectionRequest): Promise<void> {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const adminLink = `${frontendUrl}/admin/requests/${request.orderId}`;

    const html = this.buildEmailHtml(request, adminLink);

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

  private buildEmailHtml(request: InspectionRequest, adminLink: string): string {
    const {
      orderId,
      itemPrice,
      productLink,
      buyerFullName,
      buyerEmail,
      buyerWhatsapp,
      sellerName,
      sellerAddress,
    } = request;

    const itemDisplay = productLink
      ? `<a href="${productLink}" style="color:#063B27;word-break:break-all;">${productLink}</a>`
      : '<span style="color:#94A3B8;font-style:italic;">No product link provided</span>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#F0F4EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4EE;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;">

        <!-- Header -->
        <tr>
          <td style="background:#063B27;border-radius:16px 16px 0 0;padding:36px 48px 28px;">
            <p style="margin:0 0 6px 0;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1;">
              BuyPadi
            </p>
            <p style="margin:0;font-size:14px;color:#8DC342;font-weight:600;letter-spacing:0.04em;">
              Ops Console
            </p>
          </td>
        </tr>

        <!-- Alert band -->
        <tr>
          <td style="background:#8DC342;padding:16px 48px;">
            <p style="margin:0;font-size:15px;font-weight:700;color:#063B27;line-height:1.4;">
              🔔 &nbsp;New inspection request submitted
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 48px;">

            <!-- Intro sentence -->
            <p style="margin:0 0 32px 0;font-size:17px;color:#1E293B;line-height:1.6;">
              <strong>${buyerFullName}</strong> has submitted an inspection request for the item below.
              Review the details and open the request in the admin console.
            </p>

            <!-- Order ID pill -->
            <div style="margin-bottom:32px;">
              <span style="display:inline-block;background:#F0F4EE;border:1.5px solid #D4E6C3;color:#063B27;
                           font-size:13px;font-weight:700;padding:6px 16px;border-radius:24px;
                           letter-spacing:0.06em;text-transform:uppercase;">
                Order ${orderId}
              </span>
            </div>

            <!-- Key details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;border-collapse:collapse;">
              <tbody>

                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #F0F4EE;width:40%;
                              font-size:13px;font-weight:600;color:#94A3B8;text-transform:uppercase;
                              letter-spacing:0.08em;vertical-align:top;">
                    Item
                  </td>
                  <td style="padding:14px 0 14px 16px;border-bottom:1px solid #F0F4EE;
                              font-size:15px;color:#1E293B;font-weight:500;word-break:break-word;vertical-align:top;">
                    ${itemDisplay}
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #F0F4EE;
                              font-size:13px;font-weight:600;color:#94A3B8;text-transform:uppercase;
                              letter-spacing:0.08em;vertical-align:top;">
                    Item Price
                  </td>
                  <td style="padding:14px 0 14px 16px;border-bottom:1px solid #F0F4EE;
                              font-size:15px;color:#1E293B;font-weight:700;vertical-align:top;">
                    ${this.formatNaira(itemPrice)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #F0F4EE;
                              font-size:13px;font-weight:600;color:#94A3B8;text-transform:uppercase;
                              letter-spacing:0.08em;vertical-align:top;">
                    Customer
                  </td>
                  <td style="padding:14px 0 14px 16px;border-bottom:1px solid #F0F4EE;
                              font-size:15px;color:#1E293B;vertical-align:top;">
                    <span style="font-weight:600;">${buyerFullName}</span><br/>
                    <a href="mailto:${buyerEmail}" style="color:#063B27;font-size:14px;">${buyerEmail}</a><br/>
                    <span style="color:#64748B;font-size:14px;">${buyerWhatsapp}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 0;
                              font-size:13px;font-weight:600;color:#94A3B8;text-transform:uppercase;
                              letter-spacing:0.08em;vertical-align:top;">
                    Seller Location
                  </td>
                  <td style="padding:14px 0 14px 16px;
                              font-size:15px;color:#1E293B;vertical-align:top;">
                    <span style="font-weight:600;">${sellerName}</span><br/>
                    <span style="color:#64748B;font-size:14px;">${sellerAddress}</span>
                  </td>
                </tr>

              </tbody>
            </table>

            <!-- Primary CTA -->
            <div style="text-align:center;margin-bottom:16px;">
              <a href="${adminLink}"
                 style="display:inline-block;background:#063B27;color:#ffffff;
                        font-size:16px;font-weight:700;padding:16px 48px;
                        border-radius:50px;text-decoration:none;letter-spacing:0.2px;
                        line-height:1;">
                Open Request in Admin Console →
              </a>
            </div>
            <p style="margin:0;text-align:center;font-size:13px;color:#94A3B8;">
              ${adminLink}
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#063B27;border-radius:0 0 16px 16px;padding:24px 48px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#ffffff;opacity:0.55;line-height:1.5;">
              BuyPadi.ng &nbsp;·&nbsp; Inspection & Verification Services
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
  }
}
