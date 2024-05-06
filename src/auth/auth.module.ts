// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './auth.strategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session-serializer';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthStrategy, SessionSerializer, AuthService],
})
export class AuthModule {}
