import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvoicesService } from '../invoices/invoices.service';
import { InspectionRequestsService } from '../inspection-requests/inspection-requests.service';
import { AccelerateClient } from './accelerate.client';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';
import { randomBytes } from 'crypto';
import { InvoiceStatus } from '../invoices/entities/invoice.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly frontendUrl: string;

  constructor(
    private readonly accelerate: AccelerateClient,
    private readonly invoicesService: InvoicesService,
    private readonly requestsService: InspectionRequestsService,
    private readonly config: ConfigService,
  ) {
    this.frontendUrl = config.getOrThrow<string>('FRONTEND_URL');
  }

  async initiatePayment(token: string): Promise<{ redirectUrl: string }> {
    const invoice = await this.invoicesService.findByToken(token);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('This invoice has already been paid');
    }

    let reference = invoice.transactionReference;
    if (!reference) {
      reference = `BP-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`;
      await this.invoicesService.setTransactionReference(invoice.id, reference);
    }

    const accessToken = await this.accelerate.getAccessToken();
    const callbackUrl = `${this.frontendUrl}/invoice/${token}/success`;

    const redirectUrl = await this.accelerate.createTicket(accessToken, {
      pay_amount: Math.round(Number(invoice.total) * 100),
      reference,
      callback_url: callbackUrl,
      description: `BuyPadi Invoice ${invoice.invoiceNumber}`,
    });

    return { redirectUrl };
  }

  async handleWebhook(payload: WebhookPayloadDto): Promise<void> {
    const eventName = (payload.EventName ?? payload.eventName ?? '').toLowerCase();
    const data = payload.Data ?? payload.data;
    const paymentRef = data?.paymentRef ?? data?.PaymentRef ?? '';

    if (!paymentRef) {
      this.logger.warn('Webhook received with no paymentRef — ignoring');
      return;
    }

    if (eventName !== 'payment.success') {
      this.logger.log(`Webhook event "${eventName}" for ref ${paymentRef} — not a success, ignoring`);
      return;
    }

    let invoice: Awaited<ReturnType<typeof this.invoicesService.markPaidByReference>>;
    try {
      invoice = await this.invoicesService.markPaidByReference(paymentRef);
    } catch {
      this.logger.warn(`Webhook: no invoice found for ref ${paymentRef} — ignoring`);
      return;
    }

    await this.requestsService.updatePaymentConfirmed(invoice.requestId);
    this.logger.log(`Payment confirmed for invoice ${invoice.invoiceNumber}, order ${invoice.requestId}`);
  }
}
