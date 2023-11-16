import { OmitType, PartialType } from '@nestjs/swagger';
import { Resume } from '../entities/resume.entity';

export class UpdateResumeDto extends PartialType(
  OmitType(Resume, [] as const),
) {}
