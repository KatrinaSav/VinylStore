import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VinylRecordService } from '../vinyl-record/vinyl-record.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { Readable } from 'stream';

@Injectable()
export class TelegramService {
  private readonly bot: TelegramBot;
  constructor(
    private readonly vinylRecordService: VinylRecordService,
    private readonly configService: ConfigService,
  ) {
    this.bot = new TelegramBot(this.configService.get('TELEGRAM_BOT_TOKEN'), {
      polling: true,
    });
  }

  async postVinylRecord(id: string): Promise<void> {
    const vinylRecord = await this.vinylRecordService.findByIdWithImage(id);
    try {
      await this.bot.sendPhoto(
        this.configService.get('TELEGRAM_CHANNEL_ID'),
        Buffer.from(vinylRecord.image.data),
        {
          caption: `Vinyl record ${vinylRecord.name} by ${vinylRecord.authorName}.
  \n${vinylRecord.description}\nYou can buy it in our <a href="${this.configService.get('SHOP_LINK')}">shop</a>.
  \nPrice: ${vinylRecord.price}\$`,
          parse_mode: 'HTML',
        },
      );
    } catch (e) {
      throw new HttpException(
        `Failed to post: ${e.message} `,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
