import { Module, forwardRef } from '@nestjs/common';
import { Review } from './review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { LogModule } from '../log/log.module';
import { VinylRecordModule } from 'src/vinyl-record/vinyl-record.module';
import { ReviewSubscriber } from './review.subscriber';
@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    LogModule,
    forwardRef(() => VinylRecordModule),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewSubscriber],
  exports: [ReviewService],
})
export class ReviewModule {}
