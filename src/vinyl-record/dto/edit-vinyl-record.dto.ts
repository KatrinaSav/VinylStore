import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateVinylRecordDto {
  @ApiProperty({ description: 'The name of vinyle-record', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The price of vinyl-record', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'The author`s name', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @ApiProperty({
    description: 'The description of vinyl-record',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
}
