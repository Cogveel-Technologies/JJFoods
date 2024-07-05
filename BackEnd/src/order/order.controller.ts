import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('admin/orders/:state/:orderType')
  async getAdminOrdersByState(@Param('state') state, @Param('orderType') orderType) {
    // console.log(state, orderType)
    const res = await this.orderService.getAdminOrdersByState(state, orderType)
    // console.log(res)
    return res

  }
  @Get('admin/getAllOrders')
  async getAllOrders() {
    return this.orderService.getAllOrders()
  }


  @Get('admin/details')
  async getDetails() {
    console.log("called")
    const details = await this.orderService.getDetails();
    // console.log(details)
    return details

  }
  @Get('admin/getOrders/:period')
  async getOrdersByPeriod(@Param('period') period: 'today' | 'week' | 'month') {
    console.log(period)
    const res = await this.orderService.findOrdersByTimePeriod(period);
    console.log(res)
    return res
  }

  @Post('/createOrder')
  async createOrder(@Body() body) {
    console.log("order body:---------------------------", body)
    return this.orderService.createOrder(body);
  }

  @Put('state/:orderId')
  async updateOrderState(@Param('orderId') orderId: string, @Body() body) {
    console.log(orderId, body)
    return this.orderService.updateOrderState(orderId, body.state);
  }
  @Put('state/cod/:orderId')
  async updateOrderStateCod(@Param('orderId') orderId: string) {
    return this.orderService.updateOrderStateCod(orderId);
  }
  // @Put('status/:orderId')
  // async updateOrderStatus(@Param('orderId') orderId: string, @Body('status') status: string) {
  //   return this.orderService.updateOrderStatus(orderId, status);
  // }

  @Post('user')
  async getOrdersByCustomerId(@Body() body) {
    //completed or processing
    return this.orderService.getOrdersByCustomerId(body.userId, body.state);
  }

  @Post('/user/order')
  async getOrderByCustomerId(@Body() body) {

    console.log("---------------------------", body)
    return this.orderService.getOrderByCustomerId(body.userId, body.orderId)
  }

  @Post('admin/user')
  async getOrdersByCustomerIdAdmin(@Body() body) {
    //completed or processing
    return this.orderService.getOrdersByCustomerIdAdmin(body.userId, body.state);
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }


  @Post('orderAgain/:orderId')
  async orderAgain(@Param('orderId') orderId: string) {
    return this.orderService.orderAgain(orderId)
  }




}
