import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) { }

  @Post()
  @UseGuards(AuthGuard('user-jwt'))
  async payment(@Body() body) {
    return this.razorpayService.payment(body)
  }

  @Post('/fetchPaymentById')
  @UseGuards(JwtAuthGuard)
  async fetchPaymentById(@Body() body) {
    // console.log("api--------------------------------------------------------------------------------------", body)
    return this.razorpayService.fetchPaymentById(body)
  }

  @Post('handleFailure')
  @UseGuards(JwtAuthGuard)
  async handleFailure(@Body() body) {
    return this.razorpayService.handleFailure(body)
  }

  @Post('/fetchOrderById')
  @UseGuards(JwtAuthGuard)
  async fetchOrderById(@Body() body) {

    return this.razorpayService.fetchOrderById(body)
  }
}
