import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsSemVer,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ description: 'The text of the comment' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ description: 'The score for vinyl-record' })
  @IsOptional()
  @Min(0)
  @Max(5)
  @IsInt()
  score: number;
}
