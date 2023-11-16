import { SqlModel } from '@core/sql/sql.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Index, Table } from 'sequelize-typescript';

@Table
export class Resume extends SqlModel {
  @Column
  @Index
  @ApiProperty({
    description: 'Resume name',
    example: 'United States',
  })
  @IsString()
  name: string;

  @Column
  @Index
  @ApiProperty({
    description: 'Resume code',
    example: 'US',
  })
  @IsString()
  code: string;
}
