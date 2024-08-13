import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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

  async getItems() {
    const items = await this.menuCTModel.find();

    return items;
  }
  async getItem(id) {
    const item = await this.menuCTModel.findById(id);

    return item;
  }

  async updateItem(id, body, file) {
    try {

      // Find user by phone number
      const item = await this.menuCTModel.findById(id)
      if (!item) {
        throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
      }

      // Update user profile information
      const updatedItem = await this.menuCTModel.findOneAndUpdate(
        { _id: id },
        { $set: body },
        { new: true } // Return the updated document
      );

      // If a file is provided, upload the image and set the imageUrl
      if (file) {
        const imageUrl = await this.authService.uploadImage(file);
        updatedItem.item_image_url = imageUrl;
      }

      // Save the updated user document
      await updatedItem.save();

      return updatedItem;

    } catch (e) {
      throw new Error('Failed to update item');
    }

  }

  async deleteItem(id) {
    const result = await this.menuCTModel.findOneAndDelete({ _id: id });

    if (!result) {
      return {
        message: "Item not found"
      };
    }

    return {
      message: "Item deleted"
    };
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

  async getCategories() {
    const categories = await this.categoryCTModel.find();
    return categories;
  }

  async getCategory(id) {
    const category = await this.categoryCTModel.findById(id);

    return category;
  }
  async updateCategory(id, body, file) {
    try {

      // Find user by phone number
      const category = await this.categoryCTModel.findById(id)
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      // Update user profile information
      const updatedCategory = await this.categoryCTModel.findOneAndUpdate(
        { _id: id },
        { $set: body },
        { new: true } // Return the updated document
      );

      // If a file is provided, upload the image and set the imageUrl
      if (file) {
        const imageUrl = await this.authService.uploadImage(file);
        updatedCategory.category_image_url = imageUrl;
      }

      // Save the updated user document
      await updatedCategory.save();

      return updatedCategory;

    } catch (e) {
      throw new Error('Failed to update item');
    }

  }

  async deleteCategory(id) {
    const result = await this.categoryCTModel.findOneAndDelete({ _id: id });



    if (!result) {
      return {
        message: "Category not found"
      };
    }

    return {
      message: "Category deleted"
    };
  }

}
