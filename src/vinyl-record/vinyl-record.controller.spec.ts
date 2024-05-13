import { Test, TestingModule } from '@nestjs/testing';
import { VinylRecordController } from './vinyl-record.controller';
import { VinylRecordService } from './vinyl-record.service';
import { RequestUser } from 'src/user/types/request-user.type';
import { Roles } from '../user/roles.enum';
import { VinylRecordQueryDto } from './dto/vinyl-record-query.dto';
import { VinylRecord } from './vinyl-record.entity';
import { VinylRecordResponse } from './types/vinyl-record-response.type';
import { CreateVinylRecordDto } from './dto/create-vinyl-record.dto';
import { PassThrough } from 'nodemailer/lib/xoauth2';
import { PriceDto } from './dto/price.dto';
import { UpdateVinylRecordDto } from './dto/edit-vinyl-record.dto';

describe('VinylRecordController', () => {
  let vinylRecordController: VinylRecordController;
  let vinylRecordService: VinylRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VinylRecordController,
        {
          provide: VinylRecordService,
          useValue: {
            getAllVinylRecords: jest.fn(),
            addVinylRecord: jest.fn(),
            addVinylRecordFromDiscogs: jest.fn(),
            updateVinylRecordWithImage: jest.fn(),
            updateVinylRecord: jest.fn(),
            deleteVinylRecord: jest.fn(),
          },
        },
      ],
    }).compile();
    vinylRecordController = await module.resolve(VinylRecordController);
    vinylRecordService = await module.resolve(VinylRecordService);
  });

  it('should be defined', () => {
    expect(vinylRecordController).toBeDefined();
  });

  describe('.getVinylRecordsList', () => {
    const user: RequestUser = { id: 'id', role: Roles.User };
    const params = new VinylRecordQueryDto();
    const data = {
      name: 'Fire',
      authorName: 'Bill',
    };
    Object.assign(params, data);

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call VinylRecordServise.getAllVinylRecords propely', async () => {
      const vinylRecordSpy = jest.spyOn(
        vinylRecordService,
        'getAllVinylRecords',
      );
      await vinylRecordController.getVinylRecordsList(user, params);
      expect(vinylRecordSpy).toHaveBeenCalledWith(params, user);
    });

    it('should return list of Vinyl record', async () => {
      const record: VinylRecordResponse = {
        id: '12wqe1',
        name: 'Fire',
        price: 123,
        authorName: 'Bill',
        description: 'It`s hot!',
        image: 'billfire.png,',
        avgscore: 1,
        review: {},
      };
      jest
        .spyOn(vinylRecordService, 'getAllVinylRecords')
        .mockResolvedValue([record]);
      const result = await vinylRecordController.getVinylRecordsList(
        user,
        params,
      );
      expect(result).toStrictEqual([record]);
    });
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

    it('should call VinylRecordServise.addVinylRecord propely', async () => {
      const vinylRecordSpy = jest.spyOn(vinylRecordService, 'addVinylRecord');
      await vinylRecordController.addVinylRecord(record, 'userid', file);
      expect(vinylRecordSpy).toHaveBeenCalledWith(record, 'userid', file);
    });

    it('should return instance of VinylRecord', async () => {
      const record = new VinylRecord();
      const recordData = {
        name: 'Fire',
        price: 123,
        authorName: 'Bill',
        describtion: 'It`s hot!',
        image: 'billfire.png,',
      };
      Object.assign(record, recordData);

      jest
        .spyOn(vinylRecordService, 'addVinylRecord')
        .mockResolvedValue(record);
      const result = await vinylRecordController.addVinylRecord(
        record,
        'userid',
        file,
      );
      expect(result).toBeInstanceOf(VinylRecord);
    });
  });

  describe('.addVinylRecordFromDiscogs', () => {
    const price = new PriceDto();
    const data = {
      price: 123,
      describtion: 'It`s hot!',
    };
    Object.assign(price, data);

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call VinylRecordServise.addVinylRecordFromDiscogs propely', async () => {
      const vinylRecordSpy = jest.spyOn(
        vinylRecordService,
        'addVinylRecordFromDiscogs',
      );
      await vinylRecordController.addVinylRecordFromDiscogs(
        1234,
        'userid',
        price,
      );
      expect(vinylRecordSpy).toHaveBeenCalledWith(1234, 'userid', 123);
    });

    it('should return instance of VinylRecord', async () => {
      const record = new VinylRecord();
      const recordData = {
        name: 'Fire',
        price: 123,
        authorName: 'Bill',
        describtion: 'It`s hot!',
        image: 'billfire.png,',
      };
      Object.assign(record, recordData);

      jest
        .spyOn(vinylRecordService, 'addVinylRecordFromDiscogs')
        .mockResolvedValue(record);
      const result = await vinylRecordController.addVinylRecordFromDiscogs(
        1234,
        'userid',
        record,
      );
      expect(result).toBeInstanceOf(VinylRecord);
    });
  });

  describe('.editVinylRecord', () => {
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

    it('should call VinylRecordServise.updateVinylRecordWithImage propely', async () => {
      const vinylRecordSpy = jest.spyOn(
        vinylRecordService,
        'updateVinylRecordWithImage',
      );
      await vinylRecordController.editVinylRecord('id', record, 'userId', file);
      expect(vinylRecordSpy).toHaveBeenCalledWith('id', record, 'userId', file);
    });

    it('should call VinylRecordServise.updateVinylRecord propely', async () => {
      const vinylRecordSpy = jest.spyOn(
        vinylRecordService,
        'updateVinylRecord',
      );
      await vinylRecordController.editVinylRecord('id', record, 'userId', null);
      expect(vinylRecordSpy).toHaveBeenCalledWith('id', record, 'userId');
    });

    it('should return instance of VinylRecord', async () => {
      const responce = new VinylRecord();
      const recordData = {
        name: 'Fire',
        price: 123,
        authorName: 'Bill',
        describtion: 'It`s hot!',
        image: 'billfire.png,',
      };
      Object.assign(responce, recordData);

      jest
        .spyOn(vinylRecordService, 'updateVinylRecord')
        .mockResolvedValue(responce);
      const result = await vinylRecordController.editVinylRecord(
        'id',
        record,
        'userId',
        null,
      );
      expect(result).toBeInstanceOf(VinylRecord);
    });
  });

  describe('.deleteVynilRecord', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call VinylRecordServise.deleteVinylRecord propely', async () => {
      const vinylRecordSpy = jest.spyOn(
        vinylRecordService,
        'deleteVinylRecord',
      );
      await vinylRecordController.deleteVynilRecord('id', 'userId');
      expect(vinylRecordSpy).toHaveBeenCalledWith('id', 'userId');
    });

    it('should return instance of VinylRecord', async () => {
      const responce = new VinylRecord();
      const recordData = {
        name: 'Fire',
        price: 123,
        authorName: 'Bill',
        describtion: 'It`s hot!',
        image: 'billfire.png,',
      };
      Object.assign(responce, recordData);

      jest
        .spyOn(vinylRecordService, 'deleteVinylRecord')
        .mockResolvedValue(responce);
      const result = await vinylRecordController.deleteVynilRecord(
        'id',
        'userId',
      );
      expect(result).toBeInstanceOf(VinylRecord);
    });
  });
});
