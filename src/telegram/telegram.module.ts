import { Module } from '@nestjs/common';
import { VinylRecordModule } from '../vinyl-record/vinyl-record.module';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [VinylRecordModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
