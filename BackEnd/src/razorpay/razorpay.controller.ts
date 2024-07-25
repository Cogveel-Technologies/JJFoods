import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FetchPaymentByIdDto } from './dtos/fetchPaymentById.dto';
import { FailurePaymentDto } from './dtos/failurePayment.dto';

@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) { }

  // @Post()
  // @UseGuards(AuthGuard('user-jwt'))
  // async payment(@Body() body) {
  //   // console.log(body)
  //   return this.razorpayService.payment(body)
  // }

  @Post('/fetchPaymentById')
  @UseGuards(JwtAuthGuard)
  async fetchPaymentById(@Body() body: FetchPaymentByIdDto) {
    // console.log("api--------------------------------------------------------------------------------------", body)
    return this.razorpayService.fetchPaymentById(body)
  }

  @Post('handleFailure')
  @UseGuards(JwtAuthGuard)
  async handleFailure(@Body() body: FailurePaymentDto) {
    // console.log(body)
    return this.razorpayService.handleFailure(body)
  }

  @Post('/fetchOrderById')
  @UseGuards(JwtAuthGuard)
  async fetchOrderById(@Body() body) {

    return this.razorpayService.fetchOrderById(body)
  }

  @Post('/refund/:orderId')
  async refund(@Param('orderId') orderId) {
    return this.razorpayService.refund(orderId)
  }

  @Get('/fbpi/:id')
  async fbpi(@Param('id') id) {
    return this.razorpayService.fbpi(id)

  }


}
