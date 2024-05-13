import { Test, TestingModule } from '@nestjs/testing';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

describe('UserController', () => {
  let telegraController: TelegramController;
  let telergamService: TelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramController,
        {
          provide: TelegramService,
          useValue: {
            postVinylRecord: jest.fn(),
          },
        },
      ],
    }).compile();
    telegraController = await module.resolve(TelegramController);
    telergamService = await module.resolve(TelegramService);
  });

  it('should be defined', () => {
    expect(telegraController).toBeDefined();
  });

  describe('.postVinylRecord', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call TelegramService.postVinylRecord properly', async () => {
      const telergamServiceSpy = jest.spyOn(telergamService, 'postVinylRecord');
      await telegraController.postVinylRecord('userId');
      expect(telergamServiceSpy).toHaveBeenCalledWith('userId');
    });
  });
});
