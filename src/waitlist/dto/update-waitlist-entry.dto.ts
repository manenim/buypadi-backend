import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { WaitlistStatus } from '../entities/waitlist-entry.entity';

export class UpdateWaitlistEntryDto {
  @IsOptional()
  @IsEnum(WaitlistStatus)
  status?: WaitlistStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  freeInspectionCredits?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  freeDeliveryCredits?: number;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
