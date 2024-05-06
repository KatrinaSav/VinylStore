import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_API_KEY } from '../constants';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(@Inject(STRIPE_API_KEY) private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-04-10',
    });
  }

  async createCharge(
    amount: number,
    cardToken: string,
    product: string,
  ): Promise<Stripe.Response<Stripe.Charge>> {
    return await this.stripe.charges.create({
      amount: amount,
      currency: 'usd',
      description: `Purchase ${product}`,
      source: cardToken,
    });
  }
}
