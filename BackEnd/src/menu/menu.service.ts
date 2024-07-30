import { Inject, Injectable } from '@nestjs/common';
import { Menu } from './schema/menu.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MenuService {

  constructor(@InjectModel(Menu.name) private menuModel: Model<Menu>,
    @Inject(AuthService) private readonly authService: AuthService) {

  }

  async createItem(body, file) {

    const item = await new this.menuModel(body);

    if (file) {
      const imageUrl = await this.authService.uploadImage(file);
      item.imageUrl = imageUrl;
    }

    // Save the updated user document
    await item.save();

  }
}
