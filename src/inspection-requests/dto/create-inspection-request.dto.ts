import {
  IsString,
  IsEmail,
  IsOptional,
  IsUrl,
  IsNumber,
  IsPositive,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInspectionRequestDto {
  // Item info
  @IsOptional()
  @IsString()
  productLink?: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  itemPrice: number;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsUrl()
  screenshotUrl?: string;

  // Buyer info
  @IsString()
  @MinLength(2)
  buyerFullName: string;

  @IsString()
  buyerWhatsapp: string;

  @IsEmail()
  buyerEmail: string;

  // Seller info
  @IsString()
  sellerName: string;

  @IsString()
  sellerPhone: string;

  @IsString()
  sellerAddress: string;
}
