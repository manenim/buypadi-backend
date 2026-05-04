import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WaitlistStatus } from '../entities/waitlist-entry.entity';

export class UpdateWaitlistEntryDto {
  @IsOptional()
  @IsEnum(WaitlistStatus)
  status?: WaitlistStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
