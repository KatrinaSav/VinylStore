import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LogModule } from '../log/log.module';
import { UserSubscriber } from './user.subscriber';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LogModule, ImageModule],
  controllers: [UserController],
  providers: [UserService, UserSubscriber],
  exports: [UserService],
})
export class UserModule {}
