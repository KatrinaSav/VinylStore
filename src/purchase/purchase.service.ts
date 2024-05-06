import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { UserService } from '../user/user.service';
import { VinylRecordService } from '../vinyl-record/vinyl-record.service';
import { Paycheck } from './types/paycheck.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PAYMENT } from '../constants';
import { VinylRecordPaymentEvent } from '../email/send-email-event.class';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly vinylRecordService: VinylRecordService,
    private readonly stripeService: StripeService,
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  async purchaseVinylRecord(
    vinylRecordId: string,
    userId: string,
    cardToken: string,
  ): Promise<Paycheck> {
    const vinylRecord = await this.vinylRecordService.findById(vinylRecordId);
    if (!vinylRecord)
      throw new HttpException(
        'Vinyl record is not found',
        HttpStatus.NOT_FOUND,
      );
    try {
      await this.stripeService.createCharge(
        Math.floor(vinylRecord.price * 100),
        cardToken,
        vinylRecord.name,
      );
      this.userService.addPurchase(userId, vinylRecord);
      const user = await this.userService.findById(userId);
      const paycheck: Paycheck = {
        status: 'success',
        name: vinylRecord.name,
        authorName: vinylRecord.authorName,
        amount: vinylRecord.price,
      };
      this.eventEmitter.emit(
        PAYMENT,
        new VinylRecordPaymentEvent(user.email, paycheck),
      );
      return paycheck;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.PAYMENT_REQUIRED);
    }
  }
}
