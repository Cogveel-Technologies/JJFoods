import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post('add')
  @UseGuards(AuthGuard('user-jwt'))
  addItem(@Body() body) {
    // console.log(body)

    return this.wishlistService.addItem(body)
  }

  @Get('/:userId')
  @UseGuards(AuthGuard('user-jwt'))
  getUserWishlist(@Param('userId') userId) {
    return this.wishlistService.getUserWishlist(userId)
  }

  @Post('remove')
  @UseGuards(AuthGuard('user-jwt'))
  removeItem(@Body() body) {

    return this.wishlistService.removeItem(body)
  }

  @Post('remove/item')
  @UseGuards(AuthGuard('user-jwt'))
  removeItemFromList(@Body() body) {

    return this.wishlistService.removeItemFromList(body)
  }
  @Post('addToCart')
  @UseGuards(AuthGuard('user-jwt'))
  async addToCart(@Body() body) {
    // console.log("add to cart from wishlist")

    const response = await this.wishlistService.addToCart(body)
    // console.log(response)
    return response;
  }

}
