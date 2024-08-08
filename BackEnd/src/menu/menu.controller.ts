import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MenuService } from './menu.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) { }


  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createItem(@Body() body, @UploadedFile() file: Express.Multer.File,) {

    return this.menuService.createItem(body, file)
  }


  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createCategory(@Body() body, @UploadedFile() file: Express.Multer.File) {
    return this.menuService.createCategory(body, file)
  }



}
