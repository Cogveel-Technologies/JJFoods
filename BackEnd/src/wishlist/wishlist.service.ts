import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Wishlist } from './schemas/wishlist.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PetPoojaService } from 'src/pet-pooja/pet-pooja.service';
import { FeedbackService } from 'src/feedback/feedback.service';
import { CartService } from 'src/cart/cart.service';



@Injectable()
export class WishlistService {
  constructor(@InjectModel(Wishlist.name) private WishlistModel: Model<Wishlist>,
    @Inject(forwardRef(() => PetPoojaService)) private readonly petPoojaService: PetPoojaService, @Inject(forwardRef(() => FeedbackService)) private readonly feedbackService: FeedbackService,

    @Inject(forwardRef(() => CartService)) private readonly cartService: CartService) { }
  // async addItem(body) {
  //   const { userId, itemId } = body;



  //   const item = await new this.WishlistModel({
  //     user: userId,
  //     itemId
  //   })

  //   await item.save();

  //   return await this.petPoojaService.getItemById(itemId, userId)
  // }
  async addItem(body) {
    const { userId, itemId } = body;

    // Wrap in a try-catch block for error handling
    try {
      // Create a new wishlist item
      const item = new this.WishlistModel({
        user: userId,
        itemId
      });

      // Save the item and fetch the details in parallel
      await item.save();

      // Fetch the item details
      const itemDetails = await this.petPoojaService.getItemById(itemId, userId);

      return itemDetails;
    } catch (error) {
      // Handle any errors
      console.error('Error adding item:', error);
      throw new Error('Error adding item');
    }
  }

  async removeItemFromList(body) {
    const { userId, itemId } = body;

    await this.WishlistModel.deleteOne({ user: userId, itemId: itemId });

    return await this.getUserWishlist(userId)
  }

  async addToCart(body) {
    const { userId } = body;
    const { itemId, variationId } = body.product;
    await this.cartService.addCart({ ...body, quantity: 1 })

    return await this.removeItemFromList({ userId, itemId })


  }
  async getUserWishlist(userId) {
    const wishlist = await this.WishlistModel.aggregate([

      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'items',
          localField: 'itemId',
          foreignField: 'itemid',
          as: 'itemDetails'
        }
      },
      {
        $unwind: '$itemDetails'


      }
    ])
    const wishlistWithRatings = await Promise.all(wishlist.map(async item => {
      const rating = await this.feedbackService.getRating(item.itemId);
      return {
        ...item,
        itemDetails: {
          ...item.itemDetails,
          rating: rating
        }
      };
    }));

    const dicrepancystockitems = await this.petPoojaService.getStock();
    const itemsWithStock = wishlistWithRatings.map(item => {
      const stockItem = dicrepancystockitems.find(stock => stock.itemId === item.itemId);
      const itemstockquantity = stockItem ? stockItem.quantity - stockItem.used : 0; // Calculate itemstockquantity

      return {
        ...item,
        item_categoryid: item.item_categoryid,
        itemstockquantity,
      };

    });
    // console.log(itemsWithStock)
    return itemsWithStock


    return wishlistWithRatings;


  }

  async removeItem(body) {

    const { userId, itemId } = body;

    await this.WishlistModel.deleteOne({ user: userId, itemId: itemId });

    return await this.petPoojaService.getItemById(itemId, userId)
  }
}
