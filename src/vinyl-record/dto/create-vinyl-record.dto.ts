import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateVinylRecordDto {
  @ApiProperty({ description: 'The name of vinyle-record' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The price of vinyl-record' })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'The author`s name' })
  @IsString()
  authorName: string;

  @ApiProperty({ description: 'The description of vinyl-record' })
  @IsString()
  description: string;
}
