import { Inject, Injectable } from '@nestjs/common';
import { MenuCT } from './schema/menu.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CategoryCT } from './schema/categoryct.schema';

@Injectable()
export class MenuService {

  constructor(@InjectModel(MenuCT.name) private menuCTModel: Model<MenuCT>,
    @Inject(AuthService) private readonly authService: AuthService,
    @InjectModel(CategoryCT.name) private categoryCTModel: Model<CategoryCT>) {

  }

  async createItem(body, file) {

    const item = await new this.menuCTModel(body);

    if (file) {
      const imageUrl = await this.authService.uploadImage(file);
      item.item_image_url = imageUrl;
    }

    // Save the updated user document
    await item.save();

  }

  async createCategory(body, file) {
    const category = await new this.categoryCTModel(body);

    if (file) {
      const imageUrl = await this.authService.uploadImage(file);
      category.category_image_url = imageUrl;
    }

    // Save the updated user document
    await category.save();

  }
}
