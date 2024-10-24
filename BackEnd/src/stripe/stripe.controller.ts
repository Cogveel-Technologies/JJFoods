import { Body, Controller, Get, Param, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeDto } from './dtos/stripe.dto';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService
  ) { }
  @Get('pay/success/checkout/session')
  success(@Res({ passthrough: true }) res) {
    console.log(res)
    return this.stripeService.SuccessSession(res)
  }


  @Get(':couponId')
  payment(@Body() body: StripeDto[], @Param('couponId') couponId) {
    return this.stripeService.payment(body, couponId);
  }

  @Get('pay/failed/checkout/session')
  paymentSuccess() {

    return this.stripeService.failed();

  }
}
