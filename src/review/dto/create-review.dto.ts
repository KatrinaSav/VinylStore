import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsSemVer,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'The text of the comment' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ description: 'The score for vinyl-record' })
  @Min(0)
  @Max(5)
  @IsInt()
  score: number;
}
