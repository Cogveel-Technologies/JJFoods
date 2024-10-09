import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { AuthGuard } from '@nestjs/passport';
import { ApplyCouponDto } from './dtos/applyCoupon.dto';
import { CouponDto } from './dtos/coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) { }

  @Post()
  @UseGuards(AuthGuard('admin-jwt'))
  createCoupon(@Body() body: CouponDto) {
    // console.log(body)
    return this.couponService.createCoupon(body);
  }

  @Post('/apply')
  @UseGuards(AuthGuard('user-jwt'))
  async applyPromotionalCode(@Body() body: ApplyCouponDto) {
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

  @Get('admin/all')
  @UseGuards(AuthGuard('admin-jwt'))
  findAllAdmin() {
    // console.log("hello")
    return this.couponService.findAllAdmin();
  }


  @Get('/admin/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  findOne(@Param('id') id: string) {
    // console.log(id)
    const res = this.couponService.findPromotionalCodeById(id);
    return res;
  }

  @Put('admin/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  update(@Param('id') id: string, @Body() updatePromotionalCodeDto) {
    // console.log(id, updatePromotionalCodeDto)
    return this.couponService.updatePromotionalCode(id, updatePromotionalCodeDto);
  }

  @Put('admin/status/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  updateStatus(@Param('id') id) {
    // console.log("called")
    return this.couponService.updateStatus(id)
  }



  @Delete('admin/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  remove(@Param('id') id: string) {
    return this.couponService.deletePromotionalCode(id);
  }


}
