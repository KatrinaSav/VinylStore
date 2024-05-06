import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  isDateString,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false, description: 'The first name of the user' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: false, description: 'The last name of the user' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: false, description: 'The birth date of the user' })
  @IsOptional()
  @IsDateString()
  birthDate: Date;
}
