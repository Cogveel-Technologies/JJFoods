import { Injectable } from '@nestjs/common';
import { StripeDto } from './dtos/stripe.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class StripeService {

  constructor(private configService: ConfigService) { }

  stripe = require('stripe')(this.configService.get<string>('STRIPE'));

  failed() {
    return 'failed'
  }

  async payment(body: StripeDto[], couponId) {
    const lineItems = body.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name
          // images: [product?.image]

        },
        unit_amount: Math.round(product.price * 100)
      },
      quantity: product.quantity
    }))

    // const couponId = '66503e8f4737426beb4a4c20';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      discounts: [{ coupon: couponId }],
      success_url: "http://localhost:3000/stripe/pay/success/checkout/session?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/stripe/pay/failed/checkout/session"

    })
    return session

  }

  async SuccessSession(Session) {

    // console.log(Session);


  }
}
