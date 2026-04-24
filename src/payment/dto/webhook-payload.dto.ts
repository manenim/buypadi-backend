export class WebhookPayloadDto {
  EventName?: string;
  eventName?: string;
  channel?: string;
  Data?: {
    paymentRef?: string;
    PaymentRef?: string;
    transactionId?: string;
    amount?: string | number;
    date?: string;
  };
  data?: {
    paymentRef?: string;
    PaymentRef?: string;
    transactionId?: string;
    amount?: string | number;
    date?: string;
  };
}
