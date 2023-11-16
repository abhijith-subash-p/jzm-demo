import { SqlModule } from '@core/sql';
import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { Resume } from './entities/resume.entity';

@Module({
  imports: [SqlModule.register(Resume)],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
