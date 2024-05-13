import { expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { VinylRecordService } from './vinyl-record.service';
import { ReviewService } from '../review/review.service';
import { ConfigService } from '@nestjs/config';
import { VinylRecord } from './vinyl-record.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateVinylRecordDto } from './dto/create-vinyl-record.dto';
import { RequestUser } from '../user/types/request-user.type';
import { HttpException } from '@nestjs/common';
import { VinylRecordQueryDto } from './dto/vinyl-record-query.dto';
import { ImageService } from 'src/image/image.service';
import { PassThrough } from 'node:stream';
import { Image } from 'src/image/image.entity';
import { UpdateVinylRecordDto } from './dto/edit-vinyl-record.dto';
import { Roles } from 'src/user/roles.enum';

describe('VinylRecordService', () => {
  let vinylRecordService: VinylRecordService;
  let reviewService: ReviewService;
  let repository: Repository<VinylRecord>;
  let imageService: ImageService;

  beforeEach(async () => {
    const VINYL_RECORD_REPOSITORY_TOKEN = getRepositoryToken(VinylRecord);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VinylRecordService,
        {
          provide: ReviewService,
          useValue: {
            findEarliestReview: jest.fn(),
            getAvgScore: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ImageService,
          useValue: {
            saveImage: jest.fn((x) => {
              return new Image();
            }),
          },
        },
        {
          provide: VINYL_RECORD_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn((x) => Object.assign(new VinylRecord(), x)),
            find: jest.fn((x) => Object.assign(new VinylRecord(), x)),
            findOne: jest.fn((x) => Object.assign(new VinylRecord(), x)),
            findOneBy: jest.fn((x) => Object.assign(new VinylRecord(), x)),
            remove: jest.fn((x) => Object.assign(new VinylRecord(), x)),
          },
        },
      ],
    }).compile();

    vinylRecordService = await module.resolve(VinylRecordService);
    reviewService = await module.resolve(ReviewService);
    repository = await module.resolve(VINYL_RECORD_REPOSITORY_TOKEN);
    imageService = await module.resolve(ImageService);
  });

  it('should be defined', () => {
    expect(vinylRecordService).toBeDefined();
  });

  describe('.addVinylRecord', () => {
    const record = new CreateVinylRecordDto();
    const data = {
      name: 'Fire',
      price: 123,
      authorName: 'Bill',
      describtion: 'It`s hot!',
      image: 'billfire.png,',
    };
    Object.assign(record, data);

    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'testFile.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      destination: '/tmp',
      filename: 'testFile.jpg',
      path: '/tmp/testFile.jpg',
      buffer: Buffer.from([]),
      stream: new PassThrough(),
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be called properly', async () => {
      const vinylRecordServiceSpy = jest.spyOn(
        vinylRecordService,
        'addVinylRecord',
      );
      await vinylRecordService.addVinylRecord(record, 'userId', file);
      expect(vinylRecordServiceSpy).toHaveBeenCalledWith(
        record,
        'userId',
        file,
      );
    });

    it('should call Repository.save properly', async () => {
      const repositorySpy = jest.spyOn(repository, 'save');
      await vinylRecordService.addVinylRecord(record, 'userId', file);
      expect(repositorySpy).toHaveBeenCalledWith(
        { ...record, image: new Image() },
        { data: 'userId' },
      );
    });

    it('should return instance of Vinyl record', async () => {
      const result = await vinylRecordService.addVinylRecord(
        record,
        'userId',
        file,
      );
      expect(result).toBeInstanceOf(VinylRecord);
    });
  });

  describe('.updateVinylRecord', () => {
    const record = new UpdateVinylRecordDto();
    const data = {
      name: 'Fire',
      price: 123,
      authorName: 'Bill',
      describtion: 'It`s hot!',
      image: 'billfire.png,',
    };
    Object.assign(record, data);

    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'testFile.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      destination: '/tmp',
      filename: 'testFile.jpg',
      path: '/tmp/testFile.jpg',
      buffer: Buffer.from([]),
      stream: new PassThrough(),
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be called properly', async () => {
      const vinylRecordServiceSpy = jest.spyOn(
        vinylRecordService,
        'updateVinylRecord',
      );
      await vinylRecordService.updateVinylRecord('id', record, 'userId');
      expect(vinylRecordServiceSpy).toHaveBeenCalledWith(
        'id',
        record,
        'userId',
      );
    });

    it('should call Repository.findOneBy properly', async () => {
      const repositorySpy = jest.spyOn(repository, 'findOneBy');
      await vinylRecordService.updateVinylRecord('id', record, 'userId');
      expect(repositorySpy).toBeCalledWith({ id: 'id' });
      repositorySpy.mockReset();
    });

    it('should throw HttpError because Repository.findOneBy didnt find anything', async () => {
      const repositorySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockReturnValue(undefined);
      await expect(
        vinylRecordService.updateVinylRecord('id', record, 'userId'),
      ).rejects.toThrow(HttpException);
      repositorySpy.mockReset();
    });

    it('should call Repository.save properly', async () => {
      const repositorySaveSpy = jest.spyOn(repository, 'save');
      await vinylRecordService.updateVinylRecord('id', record, 'userId');
      expect(repositorySaveSpy).toBeCalledWith(
        { id: 'id', ...record },
        { data: 'userId' },
      );
    });

    it('should return instance of Vinyl record', async () => {
      const result = await vinylRecordService.updateVinylRecord(
        'id',
        record,
        'userId',
      );
      expect(result).toBeInstanceOf(VinylRecord);
    });
  });

  describe('.deleteVinylRecord', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be called properly', async () => {
      const vinylRecordServiceSpy = jest.spyOn(
        vinylRecordService,
        'deleteVinylRecord',
      );
      await vinylRecordService.deleteVinylRecord('id', 'userId');
      expect(vinylRecordServiceSpy).toHaveBeenCalledWith('id', 'userId');
    });

    it('should call Repository.findOneBy properly', async () => {
      const repositorySpy = jest.spyOn(repository, 'findOneBy');
      await vinylRecordService.deleteVinylRecord('id', 'userId');
      expect(repositorySpy).toBeCalledWith({ id: 'id' });
    });

    it('should throw HttpError because Repository.findOneBy didnt find anything', async () => {
      jest.spyOn(repository, 'findOneBy').mockReturnValue(undefined);
      await expect(
        vinylRecordService.deleteVinylRecord('id', 'userId'),
      ).rejects.toThrow(HttpException);
    });

    it('should call Repository.remove properly', async () => {
      const vinylRecord = new VinylRecord();
      const data = {
        id: '12',
        name: 'Katerina',
        authorName: 'Katyxa',
        description: 'HEPABEHCTBO',
        price: 123456,
      };
      Object.assign(vinylRecord, data);
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(vinylRecord);
      const repositorySpy = jest.spyOn(repository, 'remove');
      await vinylRecordService.deleteVinylRecord('id', 'userId');
      expect(repositorySpy).toBeCalledWith(vinylRecord, { data: 'userId' });
    });

    it('should return instance of Vinyl record', async () => {
      const result = await vinylRecordService.deleteVinylRecord('id', 'userId');
      expect(result).toBeInstanceOf(VinylRecord);
    });
  });

  describe('.findById', () => {
    it('should be called properly', async () => {
      const vinylRecordServiceSpy = jest.spyOn(vinylRecordService, 'findById');
      await vinylRecordService.findById('id');
      expect(vinylRecordServiceSpy).toHaveBeenCalledWith('id');
    });

    it('should call Repository.findOneBy properly', async () => {
      const repositorySpy = jest.spyOn(repository, 'findOneBy');
      await vinylRecordService.findById('id');
      expect(repositorySpy).toBeCalledWith({ id: 'id' });
      repositorySpy.mockReset();
    });

    it('should return instance of Vinyl record', async () => {
      const result = await vinylRecordService.findById('id');
      expect(result).toBeInstanceOf(VinylRecord);
    });
  });

  describe('.getAllVinylRecords', () => {
    const record = new VinylRecord();
    const recordData = {
      name: 'Fire',
      price: 123,
      authorName: 'Bill',
      describtion: 'It`s hot!',
      image: 'billfire.png,',
    };
    Object.assign(record, recordData);
    const params = new VinylRecordQueryDto();
    const data = {
      name: 'Fire',
      authorName: 'Bill',
    };
    Object.assign(params, data);

    const user: RequestUser = { id: 'id', role: Roles.User };

    it('should be called properly', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([record]);
      const vinylRecordServiceSpy = jest.spyOn(
        vinylRecordService,
        'getAllVinylRecords',
      );
      await vinylRecordService.getAllVinylRecords(params, user);
      expect(vinylRecordServiceSpy).toHaveBeenCalledWith(params, user);
    });

    it('should call Repository.find properly', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([record]);
      await vinylRecordService.getAllVinylRecords(params, user);
      expect(repository.find).toHaveBeenCalledWith({
        order: { [params.sort]: params.order },
        skip: params.getOffset(),
        take: params.limit,
        where: {
          ...params.getFilteringParams(),
        },
        relations: { image: true },
      });
    });
  });
});
