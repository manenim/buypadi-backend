import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  // POST /payment/initiate
  @Post('initiate')
  async initiate(@Body() dto: InitiatePaymentDto) {
    const data = await this.service.initiatePayment(dto.token);
    return { message: 'Payment initiated', data };
  }

  // POST /payment/webhook
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() payload: WebhookPayloadDto) {
    await this.service.handleWebhook(payload);
    return { success: true, message: 'Webhook received' };
  }
}
