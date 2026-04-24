import { Module } from '@nestjs/common';
import { AccelerateClient } from './accelerate.client';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { InvoicesModule } from '../invoices/invoices.module';
import { InspectionRequestsModule } from '../inspection-requests/inspection-requests.module';

@Module({
  imports: [InvoicesModule, InspectionRequestsModule],
  providers: [AccelerateClient, PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
