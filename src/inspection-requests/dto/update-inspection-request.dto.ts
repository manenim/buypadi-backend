import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectionRequestDto } from './create-inspection-request.dto';

export class UpdateInspectionRequestDto extends PartialType(
  CreateInspectionRequestDto,
) {}
