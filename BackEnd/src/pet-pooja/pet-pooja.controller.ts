import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PetPoojaService } from './pet-pooja.service';
import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('petPooja')
export class PetPoojaController {

  constructor(private readonly petPoojaService: PetPoojaService) { }

  /// stock
  @Post('addStock')
  addStock(@Body() body) {
    return this.petPoojaService.addStock(body)

  }

  @Get('getStock')
  getStock(): any {
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






  @Post('saveOrder')
  @UseGuards(AuthGuard('user-jwt'))
  saveOrder(@Body() body) {
    return this.petPoojaService.saveOrder(body)
  }
  @Post('updateData')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateData() {
    try {
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
    return this.petPoojaService.searchItems(q);
  }

  @Post('/:id')
  // @UseGuards(AuthGuard('user-jwt'))
  async getItemById(@Param('id') id: string, @Body() body) {
    // console.log("body", body)
    const response = await this.petPoojaService.getItemById(id, body.userId)

    // console.log(response)
    return response;

  }
}
