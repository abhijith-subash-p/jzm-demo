/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModelService, SqlGetAllResponse, SqlJob, SqlService } from '@core/sql';
import { Injectable } from '@nestjs/common';
import { Resume } from './entities/resume.entity';

import * as path from 'path';
import { promises as fsPromises } from 'fs';
import * as libre from 'libreoffice-convert';
import uniqid from 'uniqid';
import { SolrClient } from 'src/config/solr';

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

  // protected async doBeforeRead(job: SqlJob<Resume>): Promise<void> {
  //   // libre.convertAsync = require('util').promisify(libre.convert);

  //   const ext = '.html';
  //   const inputPath = path.join(__dirname, '../public/docIn/sample.doc');
  //   const outputPath = path.join(__dirname, `../public/docOut/out_put${ext}`);
  //   await this.convertFileToHtml(inputPath, outputPath, ext);

  //   return;
  // }

  protected async doAfterFindAll(
    job: SqlJob<Resume>,
    response: SqlGetAllResponse<Resume>,
  ): Promise<void> {
    const solrSearchRes = await this.solrSearch('HTML PUBLIC');
    console.log('SEARCH REsPonse', solrSearchRes);

    return;
  }

  /* 
  
  Resume Search
  */
  async resumeSear(job: SqlJob<Resume>) {
    console.log('job');

    console.log('JOB', job);
    return { error: null, data: undefined, offset: 10, limit: 10, count: 0 };
  }

  /* 
  Convert Files to HTML
  */
  async convertFileToHtml(
    inPath: string,
    outPath: string,
    ext: string,
  ): Promise<{ path?: string; response?: any; error: any }> {
    return new Promise(async (resolve, reject) => {
      console.log('File conversion init');
      const docxBuf = await fsPromises.readFile(inPath);
      libre.convert(docxBuf, ext, undefined, async (error, res) => {
        if ({ path: undefined, response: undefined, error: error }) {
          console.log('ERROR', error);
          reject(error);
        }
        console.log('RES', res);
        fsPromises.writeFile(outPath, res);
        console.log('File conversion completed');

        const htmlReadData = await fsPromises.readFile(outPath, 'utf-8'),
          unique_id = Math.floor(Math.random() * 1000000) + 1,
          solrData = {
            unique_id: unique_id,
            html_content: htmlReadData,
          },
          response = await this.solrAdd(solrData);
        console.log(htmlReadData);
        console.log('HTML ADDED RES', response);

        resolve({ path: outPath, response: res, error: null });
      });
    });
  }

  /* 
  Add Data to SOLR Server
  */
  async solrAdd(data: any) {
    try {
      const res = await SolrClient.add(data);
      return res;
    } catch (error) {
      return error;
    }
  }

  async solrSearch(params: any) {
    console.log(params);

    const queryParameters = {
      q: `html_content:${params}`, // Search in the html_content field
      rows: 10, // Number of rows to return
    };

    // Use the Solr client to perform the search
    const searchRes = await SolrClient.search(queryParameters);
    console.log(searchRes);
  }
}
