import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MenuService } from './menu.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) { }


  @Post('item')
  @UseInterceptors(FileInterceptor('file'))
  createItem(@Body() body, @UploadedFile() file: Express.Multer.File,) {

    return this.menuService.createItem(body, file)
  }
  @Get('items')
  getItems() {
    return this.menuService.getItems()
  }
  @Get('item/:id')
  getItem(@Param('id') id) {
    return this.menuService.getItem(id)
  }
  @Put('item/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateItem(@Param('id') id: string, @Body() body, @UploadedFile() file: Express.Multer.File,) {
    return this.menuService.updateItem(id, body, file)

  }
  @Delete('item/:id')
  deleteItem(@Param('id') id: string) {
    return this.menuService.deleteItem(id)
  }


  @Post('category')
  @UseInterceptors(FileInterceptor('file'))
  createCategory(@Body() body, @UploadedFile() file: Express.Multer.File) {
    return this.menuService.createCategory(body, file)
  }

  @Get('categories')
  getCategories() {
    return this.menuService.getCategories()
  }
  @Get('category/:id')
  getCategory(@Param('id') id) {
    return this.menuService.getCategory(id)
  }

  @Put('category/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateCategory(@Param('id') id: string, @Body() body, @UploadedFile() file: Express.Multer.File,) {
    return this.menuService.updateCategory(id, body, file)

  }
  @Delete('category/:id')
  deleteCategory(@Param('id') id: string) {
    return this.menuService.deleteCategory(id)
  }



}
