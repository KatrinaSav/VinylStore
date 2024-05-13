import { Repository } from 'typeorm';
import { expect, jest } from '@jest/globals';
import { CreateReviewDto } from './dto/create-review.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { Review } from './review.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { VinylRecordService } from 'src/vinyl-record/vinyl-record.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateVinylRecordDto } from 'src/vinyl-record/dto/edit-vinyl-record.dto';
import { VinylRecord } from 'src/vinyl-record/vinyl-record.entity';

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let reviewRepository: Repository<Review>;
  let vinylService: VinylRecordService;

  const REVIEW_REPOSITORY_TOKEN = getRepositoryToken(Review);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: VinylRecordService,
          useValue: {
            findById: jest.fn((x) => x),
          },
        },
        {
          provide: REVIEW_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn((x) => Object.assign(new Review(), x)),
            find: jest.fn(),
            findOne: jest.fn((x) => Object.assign(new Review(), x)),
            findOneBy: jest.fn((x) => x),
            findById: jest.fn(),
            remove: jest.fn(),
            average: jest.fn(() => 1),
          },
        },
      ],
    }).compile();

    reviewService = await module.resolve(ReviewService);
    reviewRepository = await module.resolve(REVIEW_REPOSITORY_TOKEN);
    vinylService = await module.resolve(VinylRecordService);
  });

  it('should be defined', () => {
    expect(reviewService).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(reviewRepository).toBeDefined();
  });

  describe('.createReview', () => {
    const dto = new CreateReviewDto();
    const data = {
      comment: 'Awesome!',
      score: 5,
    };
    Object.assign(dto, data);

    beforeEach(() => {
      jest.spyOn(reviewRepository, 'findOne').mockResolvedValueOnce(null);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call properly', async () => {
      const createReviewSpy = jest.spyOn(reviewService, 'createReview');
      await reviewService.createReview('userId', 'vinylRecordId', dto);
      expect(createReviewSpy).toHaveBeenCalledWith(
        'userId',
        'vinylRecordId',
        dto,
      );
    });

    it('should call Repository.save with correct params', async () => {
      const record = new VinylRecord();
      const data = {
        name: 'Fire',
        price: 123,
        authorName: 'Bill',
        describtion: 'It`s hot!',
        image: 'billfire.png,',
      };
      Object.assign(record, data);
      jest.spyOn(vinylService, 'findById').mockResolvedValueOnce(record);
      await reviewService.createReview('userId', 'vinylRecordId', dto);
      expect(reviewRepository.save).toHaveBeenCalledWith(
        {
          ...dto,
          author: { id: 'userId' },
          vinylRecord: record,
        },
        { data: 'userId' },
      );
    });

    it('should call Repository.findOne with correct params', async () => {
      const returnValue = new Review();
      const returnData = {
        id: 123,
        comment: 'Awesome!',
        score: 5,
      };
      Object.assign(returnValue, returnData);
      jest.spyOn(reviewRepository, 'save').mockResolvedValueOnce(returnValue);
      await reviewService.createReview('userId', 'vinylRecordId', dto);
      expect(reviewRepository.findOne).toHaveBeenCalledWith({
        where: { id: returnValue.id },
        relations: { vinylRecord: true, author: true },
      });
    });

    it('should return instance of Review', async () => {
      const returnValue = new Review();
      const returnData = {
        id: 123,
        comment: 'Awesome!',
        score: 5,
      };
      Object.assign(returnValue, returnData);
      jest.spyOn(reviewRepository, 'save').mockResolvedValueOnce(returnValue);
      jest
        .spyOn(reviewRepository, 'findOne')
        .mockResolvedValueOnce(returnValue);
      const result = await reviewService.createReview(
        'userId',
        'vinylRecordId',
        dto,
      );
      expect(result).toBeInstanceOf(Review);
    });

    it('should throw HttpException because VinylRecordService.findById didnt find anything', async () => {
      jest.spyOn(vinylService, 'findById').mockResolvedValueOnce(null);
      await expect(
        reviewService.createReview('userId', 'vinylRecordId', dto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('.getReviews', () => {
    const paginationDto = new PaginationDto();
    const data = {
      page: 1,
      limit: 2,
    };
    Object.assign(paginationDto, data);

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call properly', async () => {
      const getReviewsSpy = jest.spyOn(reviewService, 'getReviews');
      reviewService.getReviews('vinylRecordId', paginationDto);
      expect(getReviewsSpy).toBeCalledWith('vinylRecordId', paginationDto);
    });

    it('should call Repository.find with correct params', async () => {
      reviewService.getReviews('vinylRecordId', paginationDto);
      expect(reviewRepository.find).toHaveBeenCalledWith({
        where: { vinylRecord: { id: 'vinylRecordId' } },
        skip: paginationDto.getOffset(),
        take: paginationDto.limit,
      });
    });

    it('should return instance of Review', async () => {
      const returnValue = new Review();
      const returnData = {
        id: 123,
        comment: 'Awesome!',
        score: 5,
      };
      Object.assign(returnValue, returnData);
      jest.spyOn(reviewRepository, 'find').mockResolvedValueOnce([returnValue]);
      const result = await reviewService.getReviews(
        'vinylRecordId',
        paginationDto,
      );
      expect(result.every((item) => item instanceof Review)).toBe(true);
    });
  });

  describe('.deleteReview', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call properly', async () => {
      const deleteReviewSpy = jest.spyOn(reviewService, 'deleteReview');
      reviewService.deleteReview('reviewId', 'userId');
      expect(deleteReviewSpy).toBeCalledWith('reviewId', 'userId');
    });

    it('should call Repository.findOneBy with correct params', async () => {
      reviewService.deleteReview('reviewId', 'userId');
      expect(reviewRepository.findOneBy).toBeCalledWith({ id: 'reviewId' });
    });

    it('should throw exception if Repository.findOneBy return null', async () => {
      jest.spyOn(reviewRepository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(
        reviewService.deleteReview('reviewId', 'userId'),
      ).rejects.toThrow(HttpException);
    });

    it('should return instance of Review', async () => {
      const returnValue = new Review();
      const returnData = {
        id: 123,
        comment: 'Awesome!',
        score: 5,
      };
      Object.assign(returnValue, returnData);
      jest.spyOn(reviewRepository, 'remove').mockResolvedValueOnce(returnValue);
      const result = await reviewService.deleteReview('reviewId', 'userId');
      expect(result).toBeInstanceOf(Review);
    });
  });

  describe('.findEarliestReview', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call properly', async () => {
      const findEarliestReviewSpy = jest.spyOn(
        reviewService,
        'findEarliestReview',
      );
      reviewService.findEarliestReview('vinylRecordId');
      expect(findEarliestReviewSpy).toBeCalledWith('vinylRecordId');
      findEarliestReviewSpy.mockClear();
    });

    it('should call Repository.findOne with correct params', async () => {
      reviewService.findEarliestReview('vinylRecordId');
      expect(reviewRepository.findOne).toBeCalledWith({
        where: {
          vinylRecord: { id: 'vinylRecordId' },
        },
        order: { createdAt: 'ASC' },
      });
    });

    it('should return instance of Review', async () => {
      const returnValue = new Review();
      const returnData = {
        id: 123,
        comment: 'Awesome!',
        score: 5,
      };
      Object.assign(returnValue, returnData);
      jest
        .spyOn(reviewRepository, 'findOne')
        .mockResolvedValueOnce(returnValue);
      expect(
        await reviewService.findEarliestReview('vinylRecordId'),
      ).toBeInstanceOf(Review);
    });
  });

  describe('.getAvgscore', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call properly', async () => {
      const getAvgscoreSpy = jest.spyOn(reviewService, 'getAvgScore');
      reviewService.getAvgScore('vinylRecordId');
      expect(getAvgscoreSpy).toBeCalledWith('vinylRecordId');
    });

    it('should call Repository.findOne with correct params', async () => {
      reviewService.getAvgScore('vinylRecordId');
      expect(reviewRepository.average).toBeCalledWith('score', {
        vinylRecord: { id: 'vinylRecordId' },
      });
    });

    it('should return correct value', async () => {
      jest.spyOn(reviewRepository, 'average').mockResolvedValueOnce(1.2);
      expect(await reviewService.getAvgScore('vinylRecordId')).toBe(1.2);
    });
  });

  describe('.editReview', () => {
    const editDto = new UpdateReviewDto();
    const data = { comment: 'Great' };
    Object.assign(editDto, data);

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call properly', async () => {
      const editReviewSpy = jest.spyOn(reviewService, 'editReview');
      await reviewService.editReview(editDto, 'reviewId', 'userId');
      expect(editReviewSpy).toBeCalledWith(editDto, 'reviewId', 'userId');
    });

    it('should call Repository.save with correct params', async () => {
      const returnValue = new Review();
      const returnData = {
        id: '123',
        comment: 'Awesome!',
        score: 5,
      };
      Object.assign(returnValue, returnData);
      jest
        .spyOn(reviewRepository, 'findOneBy')
        .mockResolvedValueOnce(returnValue);
      await reviewService.editReview(editDto, 'reviewId', 'userId');
      expect(reviewRepository.save).toBeCalledWith(
        { ...returnValue, ...editDto },
        { data: 'userId' },
      );
    });

    it('should throw exception if Repository.findOneBy return null', async () => {
      jest.spyOn(reviewRepository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(
        reviewService.editReview(editDto, 'reviewId', 'userId'),
      ).rejects.toThrow(HttpException);
    });
  });
});
