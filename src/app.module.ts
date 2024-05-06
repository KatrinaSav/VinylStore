import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VinylRecordModule } from './vinyl-record/vinyl-record.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { PurchaseModule } from './purchase/purchase.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TelegramModule } from './telegram/telegram.module';
import databaseConfig from './config/data-base.config';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    AuthModule,
    PurchaseModule,
    VinylRecordModule,
    ReviewModule,
    TelegramModule,
    ImageModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class AppModule {}
