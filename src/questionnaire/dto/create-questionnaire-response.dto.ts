import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ScamExperience, TernaryAnswer, UserType } from '../entities/questionnaire-response.entity';

export class CreateQuestionnaireResponseDto {
  @IsEnum(UserType)
  userType: UserType;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tradeCategories: string[];

  @IsOptional()
  @IsString()
  tradeCategoryOther?: string;

  @IsString()
  currentPlatform: string;

  @IsOptional()
  @IsString()
  currentPlatformOther?: string;

  @IsString()
  @MinLength(2)
  platformPreferenceReason: string;

  @IsEnum(ScamExperience)
  scamExperience: ScamExperience;

  @IsOptional()
  @IsString()
  lossAmount?: string;

  @IsString()
  biggestIssue: string;

  @IsOptional()
  @IsString()
  biggestIssueOther?: string;

  @IsString()
  biggestFear: string;

  @IsEnum(TernaryAnswer)
  escrowInterest: TernaryAnswer;

  @IsString()
  maxFee: string;

  @IsString()
  deliveryTime: string;

  @IsString()
  deliveryFrustration: string;

  @IsString()
  transactionCompletionTime: string;

  @IsString()
  @MinLength(2)
  transactionSlowdown: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  trustFeatures: string[];

  @IsEnum(TernaryAnswer)
  payExtraForInspection: TernaryAnswer;

  @IsString()
  likelihoodToUse: string;

  @IsString()
  @MinLength(2)
  immediateUseReason: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  @MinLength(5)
  phoneNumber: string;

  @IsString()
  @MinLength(2)
  city: string;
}
