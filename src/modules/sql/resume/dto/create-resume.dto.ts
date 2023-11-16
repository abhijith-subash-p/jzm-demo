import { OmitType } from '@nestjs/swagger';
import { Resume } from '../entities/resume.entity';

export class CreateResumeDto extends OmitType(Resume, ['active'] as const) {}
