import { IsString, IsUUID } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  @IsUUID()
  token: string;
}
