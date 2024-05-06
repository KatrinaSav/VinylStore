import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Not, Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { VinylRecordService } from '../vinyl-record/vinyl-record.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly repository: Repository<Review>,
    @Inject(forwardRef(() => VinylRecordService))
    private readonly vinylRecordService: VinylRecordService,
  ) {}

  async createReview(
    userId: string,
    vinylRecordId: string,
    createDto: CreateReviewDto,
  ): Promise<Review> {
    const vinylRecord = await this.vinylRecordService.findById(vinylRecordId);
    if (!vinylRecord)
      throw new HttpException(
        'Vinyl record is not found',
        HttpStatus.NOT_FOUND,
      );
    const existingReview = await this.repository.findOne({
      where: { author: { id: userId }, vinylRecord },
    });
    if (existingReview)
      throw new HttpException(
        'Review from current user already exists',
        HttpStatus.CONFLICT,
      );
    const newReview = await this.repository.save(
      {
        ...createDto,
        author: { id: userId },
        vinylRecord,
      },
      { data: userId },
    );
    return this.repository.findOne({
      where: { id: newReview.id },
      relations: { vinylRecord: true, author: true },
    });
  }

  async getReviews(
    vinylRecordId: string,
    paginationParams: PaginationDto,
  ): Promise<Review[]> {
    return await this.repository.find({
      where: { vinylRecord: { id: vinylRecordId } },
      skip: paginationParams.getOffset(),
      take: paginationParams.limit,
    });
  }

  async deleteReview(reviewId: string, userId: string): Promise<Review> {
    const review = await this.repository.findOneBy({ id: reviewId });
    if (!review)
      throw new HttpException('Review is not found', HttpStatus.NOT_FOUND);
    return await this.repository.remove(review, { data: userId });
  }

  async findEarliestReview(vinylRecordId: string): Promise<Review> {
    return await this.repository.findOne({
      where: {
        vinylRecord: { id: vinylRecordId },
      },
      order: { createdAt: 'ASC' },
    });
  }

  async getAvgScore(vinylRecordId: string): Promise<number> {
    return await this.repository.average('score', {
      vinylRecord: { id: vinylRecordId },
    });
  }

  async editReview(
    reviewData: UpdateReviewDto,
    reviewId: string,
    userId: string,
  ) {
    const review = await this.repository.findOneBy({ id: reviewId });
    if (!review)
      throw new HttpException('Review is not found', HttpStatus.NOT_FOUND);
    return this.repository.save({ ...review, ...reviewData }, { data: userId });
  }
}
