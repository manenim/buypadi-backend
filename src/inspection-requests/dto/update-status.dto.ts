import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InspectionStatus } from '../entities/inspection-request.entity';

export class UpdateStatusDto {
  @IsEnum(InspectionStatus)
  status: InspectionStatus;

  @IsOptional()
  @IsString()
  assignedInspectorName?: string;
}
