import { Test, TestingModule } from '@nestjs/testing';
import { expect, jest } from '@jest/globals';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

describe('ReviewController', () => {
  let reviewController: ReviewController;
  let reviewService: ReviewService;

  const REVIEW_REPOSITORY_TOKEN = getRepositoryToken(Review);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: {
            editReview: jest.fn(),

            createReview: jest.fn(),

            deleteReview: jest.fn(),

            getReviews: jest.fn(),
          },
        },
      ],
    }).compile();

    reviewController = module.get<ReviewController>(ReviewController);
    reviewService = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(reviewController).toBeDefined();
  });

  describe('.createReview', () => {
    const createReviewDto = new CreateReviewDto();

    it('should call properly', async () => {
      const createReviewSpy = jest.spyOn(reviewController, 'createReview');
      reviewController.createReview('id', createReviewDto, 'userId');
      expect(createReviewSpy).toBeCalledWith('id', createReviewDto, 'userId');
    });

    it('should call reviewService.createReview properly', () => {
      jest.spyOn(reviewService, 'createReview');
      reviewController.createReview('id', createReviewDto, 'userId');
      expect(reviewService.createReview).toBeCalledWith(
        'userId',
        'id',
        createReviewDto,
      );
    });
  });

  describe('.deleteReview', () => {
    it('should call properly', async () => {
      const deleteReviewSpy = jest.spyOn(reviewController, 'deleteReview');
      reviewController.deleteReview('id', 'userId');
      expect(deleteReviewSpy).toBeCalledWith('id', 'userId');
    });

    it('should call reviewService.deleteReview properly', () => {
      const deleteReviewSpy = jest.spyOn(reviewService, 'deleteReview');
      reviewController.deleteReview('id', 'userId');
      expect(deleteReviewSpy).toBeCalledWith('id', 'userId');
    });
  });

  describe('.editReview', () => {
    const editReviewDto = new UpdateReviewDto();
    it('should call properly', async () => {
      const editReviewSpy = jest.spyOn(reviewController, 'editReview');
      reviewController.editReview(editReviewDto, 'id', 'userId');
      expect(editReviewSpy).toBeCalledWith(editReviewDto, 'id', 'userId');
    });

    it('should call reviewService.editReview properly', () => {
      const editReviewSpy = jest.spyOn(reviewService, 'editReview');
      reviewController.editReview(editReviewDto, 'id', 'userId');
      expect(editReviewSpy).toBeCalledWith(editReviewDto, 'id', 'userId');
    });
  });
});
