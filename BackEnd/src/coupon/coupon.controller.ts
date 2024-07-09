import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) { }

  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  createCoupon(@Body() body) {
    return this.couponService.createCoupon(body);
  }

  @Post('/apply')
  @UseGuards(AuthGuard('user-jwt'))
  async applyPromotionalCode(@Body() body) {
    try {
      // console.log("apply coupon", body)
      const updatedPromotionalCode = await this.couponService.decreaseUsage(body);
      // console.log("coupon response", updatedPromotionalCode)
      return updatedPromotionalCode;
    } catch (error) {
      return { error: error.message };
    }
  }
  @Get('/:userId')
  @UseGuards(AuthGuard('user-jwt'))
  findAll(@Param('userId') userId) {
    // console.log("requesttt")
    return this.couponService.findAll(userId);
  }

  @Get()
  findAllGuest() {
    // console.log("requesttt")
    return this.couponService.findAllGuest();
  }



}
