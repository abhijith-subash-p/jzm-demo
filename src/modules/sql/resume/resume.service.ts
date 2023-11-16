import { ModelService, SqlService } from '@core/sql';
import { Injectable } from '@nestjs/common';
import { Resume } from './entities/resume.entity';

@Injectable()
export class ResumeService extends ModelService<Resume> {
  /**
   * searchFields
   * @property array of fields to include in search
   */
  searchFields: string[] = ['name'];

  constructor(db: SqlService<Resume>) {
    super(db);
  }
}
