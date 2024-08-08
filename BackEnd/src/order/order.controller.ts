import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { OrderDto } from './dtos/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('/setFee')
  @UseGuards(AuthGuard('admin-jwt'))
  async setFee(@Body() body: { deliveryFee: string, platformFee: string }) {
    return this.orderService.setFee(body)
  }

  @Post('order-status')
  async handOrderStatus(@Body() body) {
    return await this.orderService.processOrderStatusUpdate(body)
  }

  @Get('admin/orders/:state/:orderType')
  @UseGuards(AuthGuard('admin-jwt'))
  async getAdminOrdersByState(@Param('state') state: 'Pending' | 'Processing' | 'Completed' | 'Cancelled' | 'OnTheWay', @Param('orderType') orderType: 'true' | 'false') {
    // console.log(state, orderType)
    const res = await this.orderService.getAdminOrdersByState(state, orderType)
    // console.log(res)
    return res

  }
  @Get('admin/getAllOrders')
  @UseGuards(AuthGuard('admin-jwt'))
  async getAllOrders() {
    return this.orderService.getAllOrders()
  }


  @Get('admin/details')
  @UseGuards(AuthGuard('admin-jwt'))
  async getDetails() {
    // console.log("called")
    const details = await this.orderService.getDetails();
    // console.log(details)
    return details

  }
  @Get('admin/getOrders/:period')
  @UseGuards(AuthGuard('admin-jwt'))
  async getOrdersByPeriod(@Param('period') period: 'today' | 'week' | 'month') {
    // console.log(period)
    const res = await this.orderService.findOrdersByTimePeriod(period);
    // console.log(res)
    return res
  }

  @Post('/createOrder')
  // @UseGuards(AuthGuard('user-jwt'))
  async createOrder(@Body() body: OrderDto) {
    // console.log("order body:---------------------------", body)
    return this.orderService.createOrder(body);
  }

  @Put('state/:orderId')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateOrderState(@Param('orderId') orderId: string, @Body() body) {
    // console.log(orderId, body)
    return this.orderService.updateOrderState(orderId, body.state);
  }
  @Put('state/pending/:orderId')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateOrderStatePending(@Param('orderId') orderId: string, @Body() body) {
    // console.log(body)
    const state: 'processing' | 'cancelled' | 'rejected' = body.state;

    return this.orderService.updateOrderStatePending(orderId, state);
  }
  // @Put('status/:orderId')
  // async updateOrderStatus(@Param('orderId') orderId: string, @Body('status') status: string) {
  //   return this.orderService.updateOrderStatus(orderId, status);
  // }
  @Put('state/cancelled/:orderId')
  @UseGuards(AuthGuard('user-jwt'))
  async updateOrderStateCancelled(@Param('orderId') orderId: string) {
    // console.log("body")
    return this.orderService.updateOrderStateCancelled(orderId);
  }


  @Post('user')
  // @UseGuards(AuthGuard('user-jwt'))
  async getOrdersByCustomerId(@Body() body: { userId: string, state: string }) {
    //completed or processing
    // console.log(body)
    const res = await this.orderService.getOrdersByCustomerId(body.userId, body.state);
    // console.log(res)
    return res
  }

  @Post('/user/order')
  @UseGuards(AuthGuard('user-jwt'))
  async getOrderByCustomerId(@Body() body: { userId: string, orderId: string }) {

    // console.log("------------called---------------", body)
    return this.orderService.getOrderByCustomerId(body.userId, body.orderId)
  }

  @Post('admin/user')
  @UseGuards(AuthGuard('admin-jwt'))
  async getOrdersByCustomerIdAdmin(@Body() body) {
    //completed or processing
    return this.orderService.getOrdersByCustomerIdAdmin(body.userId, body.state);
  }

  @Get(':orderId')
  @UseGuards(AuthGuard('user-jwt'))
  async getOrderById(@Param('orderId') orderId: string) {
    // console.log("called")
    return this.orderService.getOrderById(orderId);
  }


  @Post('orderAgain/:orderId')
  @UseGuards(AuthGuard('user-jwt'))
  async orderAgain(@Param('orderId') orderId: string) {
    return this.orderService.orderAgain(orderId)
  }




}
