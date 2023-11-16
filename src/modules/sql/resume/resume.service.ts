import { ModelService, SqlJob, SqlService } from '@core/sql';
import { Injectable } from '@nestjs/common';
import { Resume } from './entities/resume.entity';

import * as path from 'path';
import { promises as fsPromises } from 'fs';
import * as libre from 'libreoffice-convert';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async doBeforeRead(job: SqlJob<Resume>): Promise<void> {
    // libre.convertAsync = require('util').promisify(libre.convert);
    const ext = '.html';
    const inputPath = path.join(__dirname, '../public/docIn/sample.pdf');
    const outputPath = path.join(__dirname, `../public/docOut/out_put${ext}`);
    await this.convertFileToHtml(inputPath, outputPath, ext);
    return;
  }

  async convertFileToHtml(
    inPath: string,
    outPath: string,
    ext: string,
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      console.log('File conversion init');
      const docxBuf = await fsPromises.readFile(inPath);
      libre.convert(docxBuf, ext, undefined, (error, res) => {
        if (error) {
          console.log('ERROR', error);
          reject(error);
        }
        console.log('RES', res);
        fsPromises.writeFile(outPath, res);
        console.log('File conversion completed');
        resolve('File converted');
      });
    });
  }
}
