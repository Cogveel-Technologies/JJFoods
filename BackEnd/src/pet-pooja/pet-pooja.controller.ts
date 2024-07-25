import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PetPoojaService } from './pet-pooja.service';
import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('petPooja')
export class PetPoojaController {

  constructor(private readonly petPoojaService: PetPoojaService) { }

  /// stock
  // @Post('addStock')
  // addStock(@Body() body) {
  //   console.log(body)
  //   return this.petPoojaService.addStock(body)

  // }

  @Post('reservedadminquantitya')
  @UseGuards(AuthGuard('reserved-admin-a-jwt'))
  async reservedAdminQuantityA(@Body() body) {
    // console.log("called a");
    // console.log(body)
    return this.petPoojaService.reservedAdminQuantityA(body)

  }
  @Post('reservedadminquantityb')
  @UseGuards(AuthGuard('reserved-admin-b-jwt'))
  async reservedAdminQuantityB(@Body() body) {
    // console.log("called b")
    // console.log(body)
    return this.petPoojaService.reservedAdminQuantityB(body)

  }
  //authentication karni hai abhi
  @Get('getStock')
  getStock(): any {
    // console.log("called")
    return this.petPoojaService.getStock()

  }

  @Get('menu')
  fetchMenu(): any {
    // console.log("request")
    return this.petPoojaService.menu()
  }

  @Get('fetchMenu')
  async hello(): Promise<any> {
    return this.petPoojaService.menu()
  }






  // @Post('saveOrder')
  // @UseGuards(AuthGuard('user-jwt'))
  // saveOrder(@Body() body) {
  //   return this.petPoojaService.saveOrder(body)
  // }
  @Post('updateData')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateData() {
    try {
      // console.log("nissar called")
      const data = await this.petPoojaService.fetchMenu();
      await this.petPoojaService.updateDatabase(data);
      return {
        message: 'Data updated successfully'
      };
    } catch (error) {
      throw new Error(error.message)
    }
  }
  @Get('search')
  async search(@Query('q') q): Promise<any> {
    // console.log(q)
    return this.petPoojaService.searchItems(q);
  }

  @Post('/:id')
  // @UseGuards(AuthGuard('user-jwt'))
  async getItemById(@Param('id') id: string, @Body() body: { userId: string }) {
    // console.log("body", body)
    const response = await this.petPoojaService.getItemById(id, body.userId)

    // console.log(response)
    return response;

  }
}
