import { IsString, IsNumber, IsPositive, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsString()
  requestId: string;

  @IsString()
  orderId: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  inspectionFee: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  deliveryFee: number;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsString()
  customerWhatsapp: string;
}
