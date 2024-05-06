import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PriceDto {
  @ApiProperty({
    description: 'Price using in uploadig vinyl-records from Discogs',
  })
  @IsNumber()
  price: number;
}
