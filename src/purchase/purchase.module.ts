import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { VinylRecordModule } from '../vinyl-record/vinyl-record.module';
import { UserModule } from '../user/user.module';
import { StripeModule } from '../stripe/stripe.module';
import { SendEmailListener } from '../email/send-email.listener';

@Module({
  imports: [
    VinylRecordModule,
    UserModule,
    VinylRecordModule,
    StripeModule.forRootAsync(),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, SendEmailListener],
})
export class PurchaseModule {}
