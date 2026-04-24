import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionRequest } from './entities/inspection-request.entity';
import { InspectionRequestsController } from './inspection-requests.controller';
import { InspectionRequestsService } from './inspection-requests.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionRequest]), MailModule],
  controllers: [InspectionRequestsController],
  providers: [InspectionRequestsService],
  exports: [InspectionRequestsService],
})
export class InspectionRequestsModule {}
