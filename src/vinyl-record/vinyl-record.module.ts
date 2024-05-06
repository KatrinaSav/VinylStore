import { Module } from '@nestjs/common';
import { VinylRecordService } from './vinyl-record.service';
import { VinylRecord } from './vinyl-record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinylRecordController } from './vinyl-record.controller';
import { ReviewModule } from '../review/review.module';
import { LogModule } from '../log/log.module';
import { VinylRecordSubscriber } from './vinyl-record.subscriber';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VinylRecord]),
    ReviewModule,
    LogModule,
    ImageModule,
  ],
  controllers: [VinylRecordController],
  providers: [VinylRecordService, VinylRecordSubscriber],
  exports: [VinylRecordService],
})
export class VinylRecordModule {}
