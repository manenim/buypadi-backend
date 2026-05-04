import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionnaireLeadStatus } from '../entities/questionnaire-response.entity';

export class UpdateQuestionnaireResponseDto {
  @IsOptional()
  @IsEnum(QuestionnaireLeadStatus)
  leadStatus?: QuestionnaireLeadStatus;

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
