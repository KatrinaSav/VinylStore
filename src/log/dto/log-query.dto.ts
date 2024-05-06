import { IsIn, IsOptional, IsString } from 'class-validator';
import { FindOptionsWhere } from 'typeorm';
import { Log } from '../log.entity';
import { Actions } from '../actions.enum';
import { ObjectTypes } from '../object-types.enum';
import { ApiProperty } from '@nestjs/swagger';

export class LogQueryDto {
  @ApiProperty({ description: 'The id of user', required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'The id of object', required: false })
  @IsString()
  @IsOptional()
  objectId?: string;

  @ApiProperty({ description: 'The type of action', required: false })
  @IsString()
  @IsOptional()
  action?: Actions;

  @ApiProperty({ description: 'The type of object', required: false })
  @IsString()
  @IsOptional()
  objectType?: ObjectTypes;

  getFilteringParams(): FindOptionsWhere<Log> {
    const params: FindOptionsWhere<Log> = {};
    if (this.userId) params.userId = this.userId;
    if (this.objectId) params.objectId = this.objectId;
    if (this.action) params.action = this.action;
    if (this.objectType) params.objectType = this.objectType;
    return params;
  }
}
