import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { AddQuantityDto } from './dtos/addQuantity.dto';
import { AddCartDto } from './dtos/addCart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {

  }

  @Get('/nisarUncle')
  @UseGuards(AuthGuard('admin-jwt'))
  nisaruncle() {
    return "hello"
  }
  @Post('add')
  @UseGuards(AuthGuard('user-jwt'))
  async addCart(@Body() body: AddCartDto) {
    // console.log("request", body)




    const cart = await this.cartService.addCart(body);
    // console.log("response", cart)

    return cart;
  }
  @Get('/:userId')
  @UseGuards(AuthGuard('user-jwt'))
  async getUserCart(@Param('userId') userId, @Body() body: {}) {
    // console.log("param", userId)
    // console.log(body)

    const cart = await this.cartService.getUserCart(userId, body);
    // console.log("response", cart)
    return cart;
  }
  @Get('cartNumber/:userId')
  @UseGuards(AuthGuard('user-jwt'))
  async getCartNumber(@Param('userId') userId: any) {

    const cartNumber = await this.cartService.getCartNumber(userId);
    // console.log(cartNumber)
    return cartNumber;
  }

  @Post('removeItem')
  @UseGuards(AuthGuard('user-jwt'))
  async removeCartItem(@Body() body: any) {
    // console.log(body)
    const cart = await this.cartService.removeCartItem(body);
    return cart;
  }

  @Post('remove')
  @UseGuards(AuthGuard('user-jwt'))
  async removeCart(@Body() body) {
    const cart = await this.cartService.removeCart(body)
  }

  @Put('addQuantity')
  @UseGuards(AuthGuard('user-jwt'))
  async addQuantity(@Body() body: AddQuantityDto) {
    // console.log(body)


    const cart = await this.cartService.addQuantity(body);
    // console.log(cart)
    return cart;
  }

  @Put('decreaseQuantity')
  @UseGuards(AuthGuard('user-jwt'))
  async decreaseQuantity(@Body() body: AddQuantityDto) {
    // console.log("request", body)

    const cart = await this.cartService.decreaseQuantity(body);
    // console.log("response", cart)
    return cart;
  }
}