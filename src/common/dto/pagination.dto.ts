import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number',
    required: false,
    type: Number,
    default: 1,
    minimum: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    type: Number,
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Max(50)
  limit: number = 10;

  getOffset() {
    return (this.page - 1) * this.limit;
  }
}
