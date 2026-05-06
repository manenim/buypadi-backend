import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QuestionnaireLeadStatus } from '../entities/questionnaire-response.entity';

export class UpdateQuestionnaireResponseDto {
  @IsOptional()
  @IsEnum(QuestionnaireLeadStatus)
  leadStatus?: QuestionnaireLeadStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
