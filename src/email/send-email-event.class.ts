import { Paycheck } from '../purchase/types/paycheck.type';

export class VinylRecordPaymentEvent {
  to: string;
  subject: string = 'Purchase in Vinyl Store';
  text: string;
  constructor(to: string, paycheck: Paycheck) {
    this.to = to;
    this.text = `You have successfully paid ${paycheck.amount}\$ for the vinyl record "${paycheck.name}" by ${paycheck.authorName}.`;
  }
}
