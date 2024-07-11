import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('order-status')
  async handOrderStatus(@Body() body) {
    return await this.orderService.processOrderStatusUpdate(body)
  }

  @Get('admin/orders/:state/:orderType')
  @UseGuards(AuthGuard('admin-jwt'))
  async getAdminOrdersByState(@Param('state') state, @Param('orderType') orderType) {
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
  @UseGuards(AuthGuard('user-jwt'))
  async createOrder(@Body() body) {
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
    return this.orderService.updateOrderStatePending(orderId, body.state);
  }
  // @Put('status/:orderId')
  // async updateOrderStatus(@Param('orderId') orderId: string, @Body('status') status: string) {
  //   return this.orderService.updateOrderStatus(orderId, status);
  // }


  @Post('user')
  @UseGuards(AuthGuard('user-jwt'))
  async getOrdersByCustomerId(@Body() body) {
    //completed or processing
    return this.orderService.getOrdersByCustomerId(body.userId, body.state);
  }

  @Post('/user/order')
  @UseGuards(AuthGuard('user-jwt'))
  async getOrderByCustomerId(@Body() body) {

    // console.log("---------------------------", body)
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
    return this.orderService.getOrderById(orderId);
  }


  @Post('orderAgain/:orderId')
  @UseGuards(AuthGuard('user-jwt'))
  async orderAgain(@Param('orderId') orderId: string) {
    return this.orderService.orderAgain(orderId)
  }




}
