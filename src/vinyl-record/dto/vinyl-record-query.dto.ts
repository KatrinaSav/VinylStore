import { PaginationDto } from 'src/common/dto/pagination.dto';
import { VinylRecord } from '../vinyl-record.entity';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { FindOptionsWhere } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class VinylRecordQueryDto extends PaginationDto {
  @ApiProperty({ description: 'The name of vinyl-record', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The author`s name', required: false })
  @IsString()
  @IsOptional()
  authorName?: string;

  @ApiProperty({
    description: 'Sort by vinyl-records name, authors name, or price',
    required: false,
    enum: ['name', 'authorName', 'price'],
    default: 'name',
  })
  @IsOptional()
  @IsIn(['name', 'authorName', 'price'])
  sort: keyof VinylRecord = 'name';

  @ApiProperty({
    description: 'Sort order: asc or desc',
    required: false,
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  order: 'asc' | 'desc' = 'asc';

  getFilteringParams(): FindOptionsWhere<VinylRecord> {
    const params: FindOptionsWhere<VinylRecord> = {};
    if (this.name) params.name = this.name;
    if (this.authorName) params.authorName = this.authorName;
    return params;
  }
}
