import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '@nestjs/passport';
import { WishlistDto } from './dtos/wishlist.dto';
import { WishlistToCartDto } from './dtos/wishlistToCart.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post('add')
  @UseGuards(AuthGuard('user-jwt'))
  addItem(@Body() body: WishlistDto) {
    // console.log(body)

    return this.wishlistService.addItem(body)
  }

  @Get('/:userId')
  @UseGuards(AuthGuard('user-jwt'))
  getUserWishlist(@Param('userId') userId) {
    const res = this.wishlistService.getUserWishlist(userId)
    // console.log(res);
    return res;
  }

  @Post('remove')
  @UseGuards(AuthGuard('user-jwt'))
  removeItem(@Body() body: WishlistDto) {
    // console.log(body)

    return this.wishlistService.removeItem(body)
  }

  @Post('remove/item')
  @UseGuards(AuthGuard('user-jwt'))
  removeItemFromList(@Body() body) {

    return this.wishlistService.removeItemFromList(body)
  }
  @Post('addToCart')
  @UseGuards(AuthGuard('user-jwt'))
  async addToCart(@Body() body: WishlistToCartDto) {
    // console.log(body)

    const response = await this.wishlistService.addToCart(body)
    // console.log(response)
    return response;
  }

}
