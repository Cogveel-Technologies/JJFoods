import { MenuCT } from './../menu/schema/menu.schema';
import { ConfigAPI } from './../../node_modules/@types/babel__core/index.d';
import { WishlistService } from './../wishlist/wishlist.service';
import { Wishlist } from './../wishlist/schemas/wishlist.schema';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { FeedbackService } from 'src/feedback/feedback.service';
import { Feedback } from 'src/feedback/schemas/feedback.schema';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as dotenv from 'dotenv';
import { Admin } from 'src/auth/schemas/admin.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RestaurantDetails } from 'src/auth/schemas/restaurant.schema';
import { Discrepancy, StockItem } from './schemas/stock.schema';

import { CategoryCT } from 'src/menu/schema/categoryct.schema';
import { Query } from 'nest-access-control';

const getCronInterval = () => {

  dotenv.config();
  return process.env.CRON_TIME
};




@Injectable()
export class PetPoojaService {
  constructor(@InjectConnection() private readonly connection: Connection, @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>, @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>, @Inject(forwardRef(() => FeedbackService)) private readonly feedbackService: FeedbackService, @Inject(forwardRef(() => WishlistService)) private readonly wishlistService: WishlistService,
    private configService: ConfigService,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(RestaurantDetails.name) private readonly restaurantModel: Model<RestaurantDetails>,
    @InjectModel(Discrepancy.name) private discrepancyModel: Model<Discrepancy>,
    @InjectModel(StockItem.name) private stockModel: Model<StockItem>,
    @InjectModel(MenuCT.name) private menuCTModel: Model<MenuCT>,
    @InjectModel(CategoryCT.name) private categoryCTModel: Model<CategoryCT>


  ) { }

  async addStock(bulkStockItemDto) {
    const results = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const restaurantDetails = await this.restaurantModel.findOne();

    let menu = restaurantDetails.menu;


    // Find or create today's discrepancy document
    let discrepancy = await this.discrepancyModel.findOne({
      createdAt: { $gte: today },
      menu: menu
    }).exec();

    if (!discrepancy) {
      const { items } = await this.menus()
      const res = items.map((item) => {

        return {
          name: item.itemname,
          itemId: item.itemid,
          quantity: 0,
          used: 0,
          actualQuantity: 0,
          discrepancy: 0
        };
      });

      discrepancy = new this.discrepancyModel();
      discrepancy['stockItems'] = res;
      discrepancy['menu'] = menu

    }

    for (let i = 0; i < bulkStockItemDto.length; i++) {
      const stockItemDto = bulkStockItemDto[i];
      let existingStock = discrepancy.stockItems.find(item => item.itemId === stockItemDto.itemId);

      if (existingStock) {
        existingStock.quantity += stockItemDto.quantity;
        existingStock.actualQuantity = stockItemDto.actualQuantity || existingStock.actualQuantity;
        existingStock.discrepancy = - existingStock.actualQuantity + existingStock.quantity - existingStock.used;
      } else {
        const createdStock = new this.stockModel(stockItemDto);
        // createdStock.discrepancy = createdStock.actualQuantity - createdStock.quantity + createdStock.used;
        createdStock.actualQuantity = createdStock.quantity;
        discrepancy.stockItems.push(createdStock);
        results.push(createdStock);
      }
    }

    discrepancy.markModified('stockItems'); // Explicitly mark stockItems as modified
    await discrepancy.save(); // Save the updated discrepancy document to persist changes

    return discrepancy.stockItems;


  }

  async reservedAdminQuantityA(body) {
    let results = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const restaurantDetails = await this.restaurantModel.findOne();

    let menu = restaurantDetails.menu;

    // Find or create today's discrepancy document
    let discrepancy = await this.discrepancyModel.findOne({
      createdAt: { $gte: today },
      menu: menu
    }).exec();

    if (!discrepancy) {
      const { items } = await this.menus()
      const res = items.map((item) => {

        return {
          name: item.itemname,
          itemId: item.itemid,
          quantity: 0,
          used: 0,
          actualQuantity: 0,
          discrepancy: 0
        };
      });

      discrepancy = new this.discrepancyModel();
      discrepancy['stockItems'] = res;
      discrepancy['menu'] = menu

    }
    for (let i = 0; i < body.length; i++) {
      const stockItemDto = body[i];
      let existingStock = discrepancy.stockItems.find(item => item.itemId === stockItemDto.itemId);

      if (existingStock) {
        const prevQuantity = existingStock.quantity ? existingStock.quantity : 0;
        existingStock.quantity = stockItemDto.quantity;
        //  let  value=  existingStock.actualQuantity==0?stockItemDto.quantity:existingStock.actualQuantity+stockItemDto.quantity ;
        const prevActualQuantity = existingStock.actualQuantity ? existingStock.actualQuantity : 0;
        existingStock.actualQuantity = prevActualQuantity + stockItemDto.quantity - prevQuantity;
        // existingStock.discrepancy = 0;
      }
      // } else {
      //   const createdStock = new this.stockModel(stockItemDto);
      //   // createdStock.discrepancy = createdStock.actualQuantity - createdStock.quantity + createdStock.used;
      //   createdStock.actualQuantity = createdStock.quantity;
      //   discrepancy.stockItems.push(createdStock);
      //   results.push(createdStock);
      // }
    }

    discrepancy.markModified('stockItems'); // Explicitly mark stockItems as modified
    await discrepancy.save(); // Save the updated discrepancy document to persist changes
    // console.log("resadmina", discrepancy.stockItems.length)
    return discrepancy.stockItems;

  }
  async reservedAdminQuantityB(body) {
    let results = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const restaurantDetails = await this.restaurantModel.findOne();

    let menu = restaurantDetails.menu;

    // Find or create today's discrepancy document
    let discrepancy = await this.discrepancyModel.findOne({
      createdAt: { $gte: today },
      menu: menu
    }).exec();

    if (!discrepancy) {
      const { items } = await this.menus()
      const res = items.map((item) => {

        return {
          name: item.itemname,
          itemId: item.itemid,
          quantity: 0,
          used: 0,
          actualQuantity: 0,
          discrepancy: 0,

        };
      });

      discrepancy = new this.discrepancyModel();
      discrepancy['stockItems'] = res;
      discrepancy['menu'] = menu
    }
    for (let i = 0; i < body.length; i++) {
      const stockItemDto = body[i];
      let existingStock = discrepancy.stockItems.find(item => item.itemId === stockItemDto.itemId);

      if (existingStock) {

        existingStock.actualQuantity = stockItemDto.actualQuantity;
        existingStock.discrepancy = existingStock.quantity - stockItemDto.actualQuantity - existingStock.used;
      }
      // } else {
      //   const createdStock = new this.stockModel(stockItemDto);
      //   // createdStock.discrepancy = createdStock.actualQuantity - createdStock.quantity + createdStock.used;
      //   createdStock.actualQuantity = createdStock.quantity;
      //   discrepancy.stockItems.push(createdStock);
      //   results.push(createdStock);
      // }
    }

    discrepancy.markModified('stockItems'); // Explicitly mark stockItems as modified
    await discrepancy.save(); // Save the updated discrepancy document to persist changes

    return discrepancy.stockItems;

  }

  // async getStock() {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   let discrepancy = await this.discrepancyModel.findOne({
  //     createdAt: { $gte: today },
  //   }).exec();

  //   if (!discrepancy) {
  //     discrepancy = await this.discrepancyModel.findOne().sort({ createdAt: -1 }).exec();
  //   }

  //   if (!discrepancy) {
  //     const { items } = await this.menu()
  //     const res = items.map((item) => {

  //       return {
  //         name: item.itemname,
  //         itemId: item.itemid,
  //         quantity: 0,
  //         used: 0,
  //         actualQuantity: 0,
  //         discrepancy: 0
  //       };
  //     });
  //     return res
  //   }
  //   return discrepancy.stockItems;






  // }
  async getStock() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const restaurantDetails = await this.restaurantModel.findOne();

    let menu = restaurantDetails.menu;


    let discrepancy = await this.discrepancyModel.findOne({
      createdAt: { $gte: today },
      menu: menu
    }).exec();

    if (!discrepancy) {
      const startOfYesterday = new Date();
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      startOfYesterday.setHours(0, 0, 0, 0);

      const endOfYesterday = new Date();
      endOfYesterday.setDate(endOfYesterday.getDate() - 1);
      endOfYesterday.setHours(23, 59, 59, 999);

      discrepancy = await this.discrepancyModel.findOne({
        createdAt: {
          $gte: startOfYesterday,
          $lte: endOfYesterday
        },
        menu: menu
      }).sort({ createdAt: -1 }).exec();
    }

    if (!discrepancy) {
      const { items } = await this.menus();
      const res = items.map((item) => {
        return {
          name: item.itemname,
          itemId: item.itemid,
          quantity: 0,
          used: 0,
          actualQuantity: 0,
          discrepancy: 0
        };
      });
      // console.log("called")
      return res;
    }
    // console.log(discrepancy.stockItems.length)
    return discrepancy.stockItems;
  }




  async searchItems(query: string) {

    const restaurantDetails = await this.restaurantModel.findOne();
    // if (!restaurantDetails.isOpen) {
    //   return new HttpException('restaurant is not open', 450);
    // }
    // console.log('Search query:', query, typeof query);
    try {
      const sanitizedQuery = query.trim();

      if (sanitizedQuery.length < 3) {
        return []
      }

      const keyword = sanitizedQuery ? {
        $or: [
          {
            itemname: {
              $regex: sanitizedQuery,
              $options: 'i'
            }
          },
          {
            itemdescription: {
              $regex: sanitizedQuery,
              $options: 'i'
            }
          }

        ]

      } : {};
      // { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }

      // console.log('MongoDB query:', JSON.stringify(keyword, null, 2));
      if (!keyword) {
        return []
      }
      let result;
      if (restaurantDetails.menu == 'petpooja') {
        result = await this.connection.collection('items').find(keyword).toArray();
      }
      else {

        result = await this.menuCTModel.find(keyword)
      }
      // console.log('Search results:', result);
      const discrepancystockitems = await this.getStock();
      const itemsWithStock = result.map(item => {
        const stockItem = discrepancystockitems.find(stock => stock.itemId === item.itemid);
        const itemstockquantity = stockItem ? stockItem.quantity - stockItem.used : 0; // Calculate itemstockquantity

        return {
          ...item,
          item_categoryid: item.item_categoryid,
          itemstockquantity,
        };

      });
      // console.log(itemsWithStock)
      return itemsWithStock




    } catch (error) {
      // console.error('Error executing search query:', error);
      return [];
    }
  }

  async getItemByIdss(id, user) {
    try {
      const restaurantDetails = await this.restaurantModel.findOne();
      if (!restaurantDetails) {
        throw new HttpException('Restaurant details not found', 404);
      }
      if (!restaurantDetails.isOpen) {
        // return new HttpException('restaurant is not open', 450);
        return { restaurantStatus: false }
      }

      const feedback = await this.feedbackService.getRating(id)

      const itemDetail = await this.connection.collection('items').aggregate([
        { $match: { itemid: id } },
        {
          $lookup: {
            from: 'wishlists',
            let: { itemid: '$itemid' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$itemId', '$$itemid'] }, { $eq: ['$user', new mongoose.Types.ObjectId(user)] }] } } }
            ],
            as: 'isWishlist'
          }
        },
        {
          $addFields: {
            isWishlist: { $cond: { if: { $gt: [{ $size: '$isWishlist' }, 0] }, then: true, else: false } }
          }
        },
        // Optionally remove the isWishlist array if needed
        { $project: { isWishlist: 1, itemid: 1, itemallowvariation: 1, itemrank: 1, item_categoryid: 1, item_ordertype: 1, item_packingcharges: 1, itemallowaddon: 1, itemaddonbasedon: 1, item_favorite: 1, ignore_taxes: 1, ignore_discounts: 1, in_stock: 1, cuisine: 1, variation_groupname: 1, variation: 1, addon: 1, is_recommend: 1, itemname: 1, item_attributeid: 1, itemdescription: 1, minimumpreparationtime: 1, price: 1, active: 1, item_image_url: 1, item_tax: 1, gst_type: 1 } }
      ]).toArray();

      if (itemDetail.length === 0) {
        console.log('No matching items found for itemId:', id);
        return null;
      }


      return { ...itemDetail[0], feedback }; // Return the first (and only) document

    } catch (error) {
      console.error('Error fetching item details:', error);
      throw error;
    }
  }
  async getItemById(id, user) {
    try {
      const restaurantDetails = await this.restaurantModel.findOne();
      if (!restaurantDetails) {
        throw new HttpException('Restaurant details not found', 404);
      }
      // if (!restaurantDetails.isOpen) {
      //   // return new HttpException('restaurant is not open', 450);
      //   return { restaurantStatus: false }
      // }


      const feedback = await this.feedbackService.getRating(id)

      if (restaurantDetails.menu == 'petpooja') {

        const itemDetail = await this.connection.collection('items').aggregate([
          { $match: { itemid: id } },
          {
            $lookup: {
              from: 'wishlists',
              let: { itemid: '$itemid' },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ['$itemId', '$$itemid'] }, { $eq: ['$user', new mongoose.Types.ObjectId(user)] }] } } }
              ],
              as: 'isWishlist'
            }
          },
          {
            $addFields: {
              isWishlist: { $cond: { if: { $gt: [{ $size: '$isWishlist' }, 0] }, then: true, else: false } }
            }
          },
          // Optionally remove the isWishlist array if needed
          { $project: { isWishlist: 1, itemid: 1, itemallowvariation: 1, itemrank: 1, item_categoryid: 1, item_ordertype: 1, item_packingcharges: 1, itemallowaddon: 1, itemaddonbasedon: 1, item_favorite: 1, ignore_taxes: 1, ignore_discounts: 1, in_stock: 1, cuisine: 1, variation_groupname: 1, variation: 1, addon: 1, is_recommend: 1, itemname: 1, item_attributeid: 1, itemdescription: 1, minimumpreparationtime: 1, price: 1, active: 1, item_image_url: 1, item_tax: 1, gst_type: 1 } }
        ]).toArray();

        if (itemDetail.length === 0) {
          console.log('No matching items found for itemId:', id);
          return null;
        }
        const discrepancyitems = await this.getStock()

        const item = discrepancyitems.find((el) => {
          return el.itemId == itemDetail[0].itemid;
        })
        const itemstockquantity = item.quantity - item.used;

        // console.log(itemstockquantity)
        const itemDetailWithStock = { ...itemDetail[0], itemstockquantity };





        return { ...itemDetailWithStock, feedback };


        return { ...itemDetail[0], feedback };
      } // Return the first (and only) document
      else {
        const itemDetail = await this.menuCTModel.aggregate([
          { $match: { itemid: id } },
          {
            $lookup: {
              from: 'wishlists',
              let: { itemid: '$itemid' },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ['$itemId', '$$itemid'] }, { $eq: ['$user', new mongoose.Types.ObjectId(user)] }] } } }
              ],
              as: 'isWishlist'
            }
          },
          {
            $addFields: {
              isWishlist: { $cond: { if: { $gt: [{ $size: '$isWishlist' }, 0] }, then: true, else: false } }
            }
          },
          // Optionally remove the isWishlist array if needed
          { $project: { isWishlist: 1, itemid: 1, item_categoryid: 1, itemname: 1, itemdescription: 1, price: 1, item_image_url: 1 } }
        ])

        if (itemDetail.length === 0) {
          console.log('No matching items found for itemId:', id);
          return null;
        }

        const discrepancyitems = await this.getStock()

        const item = discrepancyitems.find((el) => {
          return el.itemId == itemDetail[0].itemid;
        })
        const itemstockquantity = item.quantity - item.used;

        console.log(itemstockquantity)
        const itemDetailWithStock = { ...itemDetail[0], itemstockquantity };




        return { ...itemDetailWithStock, feedback };

      }

    } catch (error) {
      console.error('Error fetching item details:', error);
      throw error;
    }
  }


  // async getItemById(id, user) {
  //   // return await this.connection.collection('items').findOne({ itemid: id })

  //   try {
  //     const itemDetail = await this.connection.collection('items').aggregate([
  //       { $match: { itemid: id } },
  //       {
  //         $lookup: {
  //           from: 'wishlists',
  //           localField: 'itemid',
  //           foreignField: 'itemId',
  //           as: 'isWishlist'
  //         }
  //       },
  //       { $unwind: '$itemDetails' }
  //     ]);


  //     return itemDetail

  //   } catch (error) {
  //     console.error('Error fetching item details:', error);
  //     throw error;
  //   }
  // }



  // async menu() {
  //   // const admin = await this.adminModel.findOne();
  //   // if (!admin?.isOpen) {
  //   //   return new HttpException('restaurant is not open', 450);
  //   // }
  //   const restaurantDetails = await this.restaurantModel.findOne();
  //   if (!restaurantDetails.isOpen) {
  //     // return new HttpException('restaurant is not open', 450);
  //     return { restaurantStatus: false }
  //   }
  //   const categories = await this.connection.collection('categories').find().toArray()
  //   const items = await this.connection.collection('items').find().toArray()

  //   return {
  //     categories: categories,
  //     items: items
  //   }
  // }
  async menus() {
    try {
      // Check if the restaurant is open
      const restaurantDetails = await this.restaurantModel.findOne();
      if (!restaurantDetails) {
        throw new HttpException('Restaurant details not found', 404);
      }
      if (!restaurantDetails.isOpen) {
        return { restaurantStatus: false };
      }

      // Retrieve categories and items
      let categories;
      let items;

      if (restaurantDetails.menu == 'petpooja') {
        categories = await this.connection.collection('categories').find().toArray();
        items = await this.connection.collection('items').find().toArray();

      }
      else {
        categories = await this.categoryCTModel.find();
        items = await this.menuCTModel.find()

      }






      // const [categories, items] = await Promise.all([
      //   this.connection.collection('categories').find().toArray(),
      //   this.connection.collection('items').find().toArray()
      // ]);

      return {
        categories: categories,
        items: items,
      };
    } catch (error) {
      // Handle specific known errors
      if (error instanceof HttpException) {
        throw error;
      }

      // Log the error and return a generic error response
      console.error('An error occurred in the menu method:', error);
      throw new HttpException('Internal server error', 500);
    }
  }
  async menu() {
    try {

      // Check if the restaurant is open
      const restaurantDetails = await this.restaurantModel.findOne();
      if (!restaurantDetails) {
        throw new HttpException('Restaurant details not found', 404);
      }
      // if (!restaurantDetails.isOpen) {
      //   return { restaurantStatus: false };
      // }
      let categories;
      let items;
      let discrepancyStockItems;

      if (restaurantDetails.menu == 'petpooja') {
        [categories, items, discrepancyStockItems] = await Promise.all([
          this.connection.collection('categories').find().toArray(),
          this.connection.collection('items').find().toArray(),
          this.getStock(), // Call getStock to retrieve discrepancy data
        ]);


      }
      else {






        // Retrieve categories and items
        [categories, items, discrepancyStockItems] = await Promise.all([
          this.categoryCTModel.find(),
          this.menuCTModel.find(),
          this.getStock(), // Call getStock to retrieve discrepancy data
        ]);
      }
      const categoryMap = categories.reduce((map, category) => {
        map[category.categoryid] = category;
        return map;
      }, {});




      // Map itemstockquantity to items using quantity - used
      const itemsWithStock = items.map(item => {
        const stockItem = discrepancyStockItems.find(stock => stock.itemId === item.itemid);
        const itemstockquantity = stockItem ? stockItem.quantity - stockItem.used : 0; // Calculate itemstockquantity

        return {
          ...item,
          item_categoryid: item.item_categoryid,
          itemstockquantity,
        };

      });


      const groupedItems = itemsWithStock.reduce((result, item) => {
        const categoryid = item.item_categoryid;
        if (categoryMap[categoryid]) {
          if (!result[categoryid]) {
            result[categoryid] = {
              category: categoryMap[categoryid],
              items: [],
            };
          }
          result[categoryid].items.push(item);
        }
        return result;
      }, {});

      // console.log(groupedItems)

      return groupedItems;




      return {
        categories,
        items: itemsWithStock,
      };

    } catch (error) {
      // Handle specific known errors
      if (error instanceof HttpException) {
        throw error;
      }

      // Log the error and return a generic error response
      console.error('An error occurred in the menu method:', error);
      throw new HttpException('Internal server error', 500);
    }
  }
  transformData(data) {
    const transformedData = [];

    for (let key in data) {
      transformedData.push(data[key])

    }



    return transformedData;
  }
  async paginatedMenu(page) {
    try {
      const resPerPage = 66;
      const currentPage = Number(page) || 1
      const skip = resPerPage * (currentPage - 1);
      // Check if the restaurant is open
      const restaurantDetails = await this.restaurantModel.findOne();
      if (!restaurantDetails) {
        throw new HttpException('Restaurant details not found', 404);
      }
      // if (!restaurantDetails.isOpen) {
      //   return { restaurantStatus: false };
      // }
      let categories;
      let items;
      let discrepancyStockItems;

      if (restaurantDetails.menu == 'petpooja') {
        [categories, items, discrepancyStockItems] = await Promise.all([
          this.connection.collection('categories').find().limit(resPerPage).skip(skip).toArray(),
          this.connection.collection('items').find().toArray(),
          this.getStock(), // Call getStock to retrieve discrepancy data
        ]);

        // console.log(categories)

      }
      else {






        // Retrieve categories and items
        [categories, items, discrepancyStockItems] = await Promise.all([
          this.categoryCTModel.find().limit(resPerPage).skip(skip),
          this.menuCTModel.find(),
          this.getStock(), // Call getStock to retrieve discrepancy data
        ]);
      }
      const categoryMap = categories.reduce((map, category) => {
        map[category.categoryid] = category;
        return map;
      }, {});




      // Map itemstockquantity to items using quantity - used
      const itemsWithStock = items.map(item => {
        const stockItem = discrepancyStockItems.find(stock => stock.itemId === item.itemid);
        const itemstockquantity = stockItem ? stockItem.quantity - stockItem.used : 0; // Calculate itemstockquantity

        return {
          ...item,
          item_categoryid: item.item_categoryid,
          itemstockquantity,
        };

      });


      const groupedItems = itemsWithStock.reduce((result, item) => {
        const categoryid = item.item_categoryid;
        if (categoryMap[categoryid]) {
          if (!result[categoryid]) {
            result[categoryid] = {
              category: categoryMap[categoryid],
              items: [],
            };
          }
          result[categoryid].items.push(item);
        }
        return result;
      }, {});

      // console.log(groupedItems)
      // return groupedItems
      return this.transformData(groupedItems);




      return {
        categories,
        items: itemsWithStock,
      };

    } catch (error) {
      // Handle specific known errors
      if (error instanceof HttpException) {
        throw error;
      }

      // Log the error and return a generic error response
      console.error('An error occurred in the menu method:', error);
      throw new HttpException('Internal server error', 500);
    }
  }
  // async menu() {
  //   try {
  //     // Check if the restaurant is open
  //     const restaurantDetails = await this.restaurantModel.findOne().lean();
  //     if (!restaurantDetails) {
  //       throw new HttpException('Restaurant details not found', 404);
  //     }
  //     if (!restaurantDetails.isOpen) {
  //       return { restaurantStatus: false };
  //     }

  //     // Retrieve categories and items in parallel
  //     const [categories, items, discrepancyStockItems] = await Promise.all([
  //       this.connection.collection('categories').find().toArray(),
  //       this.connection.collection('items').find().toArray(),
  //       this.getStock(), // Call getStock to retrieve discrepancy data
  //     ]);

  //     // Create a category map for quick lookup
  //     const categoryMap = categories.reduce((map, category) => {
  //       map[category.categoryid] = category;
  //       return map;
  //     }, {});

  //     // Create a stock map for quick lookup
  //     const stockMap = discrepancyStockItems.reduce((map, stock) => {
  //       map[stock.itemId] = stock;
  //       return map;
  //     }, {});

  //     // Map itemstockquantity to items using quantity - used and group items by category
  //     const groupedItems = items.reduce((result, item) => {
  //       const stockItem = stockMap[item.itemid];
  //       const itemstockquantity = stockItem ? stockItem.quantity - stockItem.used : 0; // Calculate itemstockquantity

  //       const categoryid = item.item_categoryid;
  //       if (categoryMap[categoryid]) {
  //         if (!result[categoryid]) {
  //           result[categoryid] = {
  //             category: categoryMap[categoryid],
  //             items: [],
  //           };
  //         }
  //         result[categoryid].items.push({
  //           ...item,
  //           itemstockquantity,
  //         });
  //       }
  //       return result;
  //     }, {});

  //     return groupedItems;

  //   } catch (error) {
  //     // Handle specific known errors
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }

  //     // Log the error and return a generic error response
  //     console.error('An error occurred in the menu method:', error);
  //     throw new HttpException('Internal server error', 500);
  //   }
  // }





  // @Cron(getCronInterval())
  // async handleCron() {
  //   // console.log("updated successfully 123")
  //   const data = await this.fetchMenu();
  //   this.updateDatabase(data)
  //   return "updated"
  // }
  async updateDatabase(data: any) {
    try {
      // Clear existing data and insert new data into respective collections
      await this.connection.collection('restaurants').deleteMany({});
      await this.connection.collection('restaurants').insertMany(data.restaurants);

      await this.connection.collection('ordertypes').deleteMany({});
      await this.connection.collection('ordertypes').insertMany(data.ordertypes);

      await this.connection.collection('items').deleteMany({});
      await this.connection.collection('items').insertMany(data.items);

      await this.connection.collection('categories').deleteMany({});
      await this.connection.collection('categories').insertMany(data.categories);

      // await this.connection.collection('parentcategories').deleteMany({});
      // await this.connection.collection('parentcategories').insertMany(data.parentcategories);

      await this.connection.collection('variations').deleteMany({});
      await this.connection.collection('variations').insertMany(data.variations);

      await this.connection.collection('addongroups').deleteMany({});
      await this.connection.collection('addongroups').insertMany(data.addongroups);

      await this.connection.collection('attributes').deleteMany({});
      await this.connection.collection('attributes').insertMany(data.attributes);

      await this.connection.collection('taxes').deleteMany({});
      await this.connection.collection('taxes').insertMany(data.taxes);

      // await this.connection.collection('discounts').deleteMany({});
      // await this.connection.collection('discounts').insertMany(data.discounts);

      console.log('Database updated successfully');
    } catch (error) {
      console.error('Error updating the database:', error);
    }
  }

  async pushmenu(data) {
    try {
      // Clear existing data and insert new data into respective collections
      await this.connection.collection('restaurants').deleteMany({});
      await this.connection.collection('restaurants').insertMany(data.restaurants);

      await this.connection.collection('ordertypes').deleteMany({});
      await this.connection.collection('ordertypes').insertMany(data.ordertypes);

      await this.connection.collection('items').deleteMany({});
      await this.connection.collection('items').insertMany(data.items);

      await this.connection.collection('categories').deleteMany({});
      await this.connection.collection('categories').insertMany(data.categories);

      // await this.connection.collection('parentcategories').deleteMany({});
      // await this.connection.collection('parentcategories').insertMany(data.parentcategories);

      await this.connection.collection('variations').deleteMany({});
      await this.connection.collection('variations').insertMany(data.variations);

      await this.connection.collection('addongroups').deleteMany({});
      await this.connection.collection('addongroups').insertMany(data.addongroups);

      await this.connection.collection('attributes').deleteMany({});
      await this.connection.collection('attributes').insertMany(data.attributes);

      await this.connection.collection('taxes').deleteMany({});
      await this.connection.collection('taxes').insertMany(data.taxes);

      // await this.connection.collection('discounts').deleteMany({});
      // await this.connection.collection('discounts').insertMany(data.discounts);

      return {
        "success": "1",
        "message": "Menu items are successfully listed."
      }
    } catch (error) {
      console.error('Error updating the database:', error);
    }
  }

  async fetchMenu() {
    const url = 'https://qle1yy2ydc.execute-api.ap-southeast-1.amazonaws.com/V1/mapped_restaurant_menus';
    const data = { "restID": "pt90esg5" };

    // Define headers
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('app-key', this.configService.get<string>('PETPOOJA_KEY'));
    headers.append('app-secret', this.configService.get<string>('PETPOOJA_SECRET'));
    headers.append('access-token', this.configService.get<string>('PETPOOJA_TOKEN'));

    // console.log("request")

    // Make the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });



    // Serialize the modified JSON back to a string
    // const modifiedJsonResponse = JSON.stringify(data, null, 4);

    // Handle the response
    if (response.ok) {

      const responseData = await response.json();
      // if (Array.isArray(responseData.categories)) {
      //   responseData.categories = responseData.categories.slice(0, 30);
      // }
      // let categoryIds = responseData.categories.map(category => category.category_id);

      // // Filter the items array to only include items with matching item_categoryid
      // responseData.items = responseData.items.filter(item => categoryIds.includes(item.item_categoryid));





      // Process responseData as needed
      return responseData;
    } else {
      // Handle errors
      throw new Error('Error making fetch request');
    }
  }


  async saveOrder(body) {
    const url = 'https://47pfzh5sf2.execute-api.ap-southeast-1.amazonaws.com/V1/save_order';
    // console.log("called")

    const data = this.mapOrderToApiPayload(body);

    console.log("--------", JSON.stringify(data))
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,

      body: JSON.stringify(data),
    });

    // Handle the response
    if (response.ok) {
      const responseData = await response.json();
      // Process responseData as needed
      // console.log(responseData)
      return responseData;
    } else {
      // Handle errors
      return {
        status: 0
      }

      throw new Error('Error making fetch request');
    }

  }


  // async saveOrder(body) {
  //   const url = 'https://47pfzh5sf2.execute-api.ap-southeast-1.amazonaws.com/V1/save_order';

  //   const data = {
  //     "app_key": "rbe4f7cmhgkyt956p8qdnx1woj30u2is",
  //     "app_secret": "344c14cc1be345008418ea80abe9a69faa4bf214",
  //     "access_token": "89e4b208c6f0fda02148cfaa90c122d1e9fa5de1",
  //     "orderinfo": {
  //       "OrderInfo": {
  //         "Restaurant": {
  //           "details": {
  //             "res_name": "jj foods",
  //             "address": "2nd Floor, Reliance Mall, Nr.Akshar Chowk",
  //             "contact_information": "9427846660",
  //             "restID": "pt90esg5"
  //           }
  //         },
  //         "Customer": {
  //           "details": {
  //             "email": "xxx@yahoo.com",
  //             "name": "Advait",
  //             "address": "2, Amin Society, Naranpura",
  //             "phone": "9090909090",
  //             "latitude": "34.11752681212772",
  //             "longitude": "74.72949172653219"
  //           }
  //         },
  //         "Order": {
  //           "details": {
  //             "orderID": "A-1",
  //             "preorder_date": "2022-01-01",
  //             "preorder_time": "15:50:00",
  //             "service_charge": "0",
  //             // "sc_tax_amount": "0",
  //             "delivery_charges": "50",
  //             "dc_tax_amount": "2.5",
  //             "dc_gst_details": [
  //               {
  //                 "gst_liable": "vendor",
  //                 "amount": "2.5"
  //               },
  //               {
  //                 "gst_liable": "restaurant",
  //                 "amount": "0"
  //               }
  //             ],
  //             "packing_charges": "20",
  //             "pc_tax_amount": "1",
  //             "pc_gst_details": [
  //               {
  //                 "gst_liable": "vendor",
  //                 "amount": "1"
  //               },
  //               {
  //                 "gst_liable": "restaurant",
  //                 "amount": "0"
  //               }
  //             ],
  //             "order_type": "H",
  //             "ondc_bap": "buyerAppName",
  //             "advanced_order": "N",
  //             "payment_type": "COD",
  //             "table_no": "",
  //             "no_of_persons": "0",
  //             "discount_total": "45",
  //             "tax_total": "65.52",
  //             "discount_type": "F",
  //             "total": "560",
  //             "description": "",
  //             "created_on": "2022-01-01 15:49:00",
  //             "enable_delivery": 1,
  //             "min_prep_time": 20,
  //             "callback_url": "https.xyz.abc",
  //             "collect_cash": "480",
  //             "otp": "9876"
  //           }
  //         },
  //         "OrderItem": {
  //           "details": [
  //             {
  //               "id": "7765862",
  //               "name": "Garlic Bread (3Pieces)",
  //               "gst_liability": "vendor",
  //               "item_tax": [
  //                 {
  //                   "id": "11213",
  //                   "name": "CGST",
  //                   "amount": "3.15"
  //                 },
  //                 {
  //                   "id": "20375",
  //                   "name": "SGST",
  //                   "amount": "3.15"
  //                 }
  //               ],
  //               "item_discount": "14",
  //               "price": "140.00",
  //               "final_price": "126",
  //               "quantity": "1",
  //               "description": "",
  //               "variation_name": "3Pieces",
  //               "variation_id": "89058",
  //               "AddonItem": {
  //                 "details": [

  //                 ]
  //               }
  //             },
  //             {
  //               "id": "118829149",
  //               "name": "Veg Loaded Pizza",
  //               "gst_liability": "vendor",
  //               "item_tax": [
  //                 {
  //                   "id": "11213",
  //                   "name": "CGST",
  //                   "amount": "2.75"
  //                 },
  //                 {
  //                   "id": "20375",
  //                   "name": "SGST",
  //                   "amount": "2.75"
  //                 }
  //               ],
  //               "item_discount": "",
  //               "price": "110.00",
  //               "final_price": "110.00",
  //               "quantity": "1",
  //               "description": "",
  //               "variation_name": "",
  //               "variation_id": "",
  //               "AddonItem": {
  //                 "details": [
  //                   {
  //                     "id": "1150783",
  //                     "name": "Mojito",
  //                     "group_name": "Add Beverage",
  //                     "price": "0",
  //                     "group_id": 135699,
  //                     "quantity": "1"
  //                   },
  //                   {
  //                     "id": "1150813",
  //                     "name": "Cheese",
  //                     "group_name": "Extra Toppings",
  //                     "price": "10",
  //                     "group_id": 135707,
  //                     "quantity": "1"
  //                   }
  //                 ]
  //               }
  //             },
  //             {
  //               "id": "118807411",
  //               "name": "Chocolate Cake",
  //               "gst_liability": "restaurant",
  //               "item_tax": [
  //                 {
  //                   "id": "21866",
  //                   "name": "CGST",
  //                   "amount": "25.11"
  //                 },
  //                 {
  //                   "id": "21867",
  //                   "name": "SGST",
  //                   "amount": "25.11"
  //                 }
  //               ],
  //               "item_discount": "31",
  //               "price": "310.00",
  //               "final_price": "279",
  //               "quantity": "1",
  //               "description": "",
  //               "variation_name": "",
  //               "variation_id": "",
  //               "AddonItem": {
  //                 "details": [

  //                 ]
  //               }
  //             }
  //           ]
  //         },
  //         "Tax": {
  //           "details": [
  //             {
  //               "id": "11213",
  //               "title": "CGST",
  //               "type": "P",
  //               "price": "2.5",
  //               "tax": "5.9",
  //               "restaurant_liable_amt": "0.00"
  //             },
  //             {
  //               "id": "20375",
  //               "title": "SGST",
  //               "type": "P",
  //               "price": "2.5",
  //               "tax": "5.9",
  //               "restaurant_liable_amt": "0.00"
  //             },
  //             {
  //               "id": "21866",
  //               "title": "CGST",
  //               "type": "P",
  //               "price": "9",
  //               "tax": "25.11",
  //               "restaurant_liable_amt": "25.11"
  //             },
  //             {
  //               "id": "21867",
  //               "title": "SGST",
  //               "type": "P",
  //               "price": "9",
  //               "tax": "25.11",
  //               "restaurant_liable_amt": "25.11"
  //             }
  //           ]
  //         },
  //         "Discount": {
  //           "details": [
  //             {
  //               "id": "362",
  //               "title": "Discount",
  //               "type": "F",
  //               "price": "45"
  //             }
  //           ]
  //         }
  //       },
  //       "udid": "",
  //       "device_type": "Web"
  //     }
  //   }
  //   const headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers: headers,

  //     body: JSON.stringify(data),
  //   });

  //   // Handle the response
  //   if (response.ok) {
  //     const responseData = await response.json();
  //     // Process responseData as needed
  //     return responseData;
  //   } else {
  //     // Handle errors
  //     throw new Error('Error making fetch request');
  //   }

  // }

  generateOrderId(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let orderId = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      orderId += characters[randomIndex];
    }
    return orderId;
  }
  convertTo24HourFormat(timeStr) {
    // Split the time string into parts
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    // Convert hours to 24-hour format
    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    // Ensure hours and minutes are two digits
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.padStart(2, '0');

    // Add seconds as 00
    let seconds = '00';

    return `${hours}:${minutes}:${seconds}`;
  }

  getCurrentTime(): string {
    // Get the current date and time
    const now: Date = new Date();

    // Get hours, minutes, and seconds
    let hours: number | string = now.getHours();
    let minutes: number | string = now.getMinutes();
    let seconds: number | string = now.getSeconds();

    // Ensure hours, minutes, and seconds are two digits
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }
  getCurrentDate(): string {
    // Get the current date
    const now: Date = new Date();

    // Get year, month, and day
    const year: number = now.getFullYear();
    let month: number | string = now.getMonth() + 1; // Months are zero-based, so add 1
    let day: number | string = now.getDate();

    // Ensure month and day are two digits
    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');

    return `${year}:${month}:${day}`;
  }

  orderPreference(x) {
    if (x == 'Deliver to my Address') {
      return 'H'
    }
    else if (x == 'Eat at Restaurant') {
      return 'D'
    }
    else {
      return 'P'
    }



  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  private mapOrderToApiPayload(order) {
    // console.log(order.id)

    const getSafeValue = (value, defaultValue = '') => value !== undefined && value !== null ? value.toString() : defaultValue;

    const res =
    {
      app_key: this.configService.get<string>('PETPOOJA_KEY'),
      app_secret: this.configService.get<string>('PETPOOJA_SECRET'),
      access_token: this.configService.get<string>('PETPOOJA_TOKEN'),
      orderinfo: {
        OrderInfo: {
          Restaurant: {
            details: {
              res_name: 'jj foods',
              address: '2nd Floor, Reliance Mall, Nr.Akshar Chowk',
              contact_information: '9427846660',
              restID: "pt90esg5",
            },
          },
          Customer: {
            details: {
              email: getSafeValue(order.user?.emailId),
              name: getSafeValue(order.user?.name),
              address: `${getSafeValue(order.address?.address1)}, ${getSafeValue(order.address?.address2)}, ${getSafeValue(order.address?.address3)}`,
              phone: getSafeValue(order.user?.phoneNumber),
              latitude: '34.11752681212772',// order?.address?.latitude,
              longitude: '74.72949172653219',//order?address?.longitude
            },
          },
          Order: {
            details: {
              orderID: order.id,
              // orderID: this.generateOrderId(),
              preorder_time: getSafeValue(order.preOrder?.orderTime) ? this.convertTo24HourFormat(order.preOrder?.orderTime) : this.getCurrentTime(),
              preorder_date: getSafeValue(order.preOrder?.orderDate) ? getSafeValue(order.preOrder?.orderDate) : this.getCurrentDate(),
              service_charge: order.platformFee,
              // sc_tax_amount: '0',
              delivery_charges: getSafeValue(order.deliveryFee, '0'),
              // dc_tax_amount: getSafeValue(order.sgst, '0'),
              // dc_gst_details: [
              //   {
              //     gst_liable: 'vendor',
              //     amount: getSafeValue(order.sgst, '0'),
              //   },
              //   {
              //     gst_liable: 'restaurant',
              //     amount: '0',
              //   },
              // ],
              // packing_charges: getSafeValue(order.platformFee, '0'),//this is the container charge
              // pc_tax_amount: getSafeValue(order.cgst, '0'),
              // pc_gst_details: [
              //   {
              //     gst_liable: 'vendor',
              //     amount: getSafeValue(order.cgst, '0'),
              //   },
              //   {
              //     gst_liable: 'restaurant',
              //     amount: '0',
              //   },
              // ],
              order_type: this.orderPreference(order.orderPreference),
              ondc_bap: 'JJFOODS',
              advanced_order: order.preOrder.type ? 'Y' : 'N',
              payment_type: order.payment?.paymentMethod === 'online' ? 'ONLINE' : 'COD',
              table_no: '',
              no_of_persons: '1',
              discount_total: getSafeValue(order.discount?.discount, '0'),
              tax_total: getSafeValue(order.cgst + order.sgst, '0'),
              discount_type: order.discount?.discount ? 'F' : "",// dynamic
              total: getSafeValue(order.grandTotal - order.deliveryFee, '0'),
              description: '',
              created_on: this.formatDate(new Date(order.createdAt)),
              // enable_delivery: order.orderPreference === 'Deliver to my Address' ? 1 : 0,
              enable_delivery: 1,
              min_prep_time: 20,
              callback_url: this.configService.get<string>('WEBHOOKURL'),
              collect_cash: getSafeValue(order.grandTotal, '0'),
              otp: '9876',
            },
          },
          OrderItem: {
            details: order.products.map((product) => ({
              id: getSafeValue(product.itemId),
              name: product.name,
              gst_liability: 'restaurant',
              item_tax: [
                {
                  id: '11213',
                  name: 'CGST',
                  amount: getSafeValue((parseFloat(product.price) * 0.025 * product.quantity).toFixed(2)),
                },
                {
                  id: '20375',
                  name: 'SGST',
                  amount: getSafeValue((parseFloat(product.price) * 0.025 * product.quantity).toFixed(2)),
                },
              ],
              // item_discount: '0',
              price: getSafeValue(product.price),
              final_price: getSafeValue((parseFloat(product.price) * product.quantity).toString()),
              quantity: getSafeValue(product.quantity),
              // description: '',
              // variation_name: '',
              // variation_id: '',
              // AddonItem: {
              //   details: [],
              // },
            })),
          },
          Tax: {
            details: [
              {
                id: '11213',
                title: 'CGST',
                type: 'P',
                price: '2.5',
                tax: getSafeValue(order.cgst, '0'),
                restaurant_liable_amt: '0.00',
              },
              {
                id: '20375',
                title: 'SGST',
                type: 'P',
                price: '2.5',
                tax: getSafeValue(order.sgst, '0'),
                restaurant_liable_amt: '0.00',
              },
              // {
              //   id: '21866',
              //   title: 'Platform Fee',
              //   type: 'F',
              //   price: order.platformFee,
              //   tax: order.platformFee,
              //   restaurant_liable_amt: '0.00',
              // },
              // 

            ],
          },
          // Discount: {
          //   details: [
          //     {
          //       id: order.discount?.couponId || "0",//dynamic
          //       title: 'Discount',
          //       type: 'F',//dynamic
          //       price: getSafeValue(order.discount?.discount, '0'),
          //     },
          //   ],
          // },
        },
        udid: '',
        device_type: 'Web',
      },
    };
    // console.log(res)
    return res;
  }
  // private mapOrderToApiPayload(order) {
  //   const getSafeValue = (value, defaultValue = '') => value !== undefined && value !== null ? value.toString() : defaultValue;

  //   return {
  //     app_key: this.configService.get<string>('PETPOOJA_KEY'),
  //     app_secret: this.configService.get<string>('PETPOOJA_SECRET'),
  //     access_token: this.configService.get<string>('PETPOOJA_TOKEN'),
  //     orderinfo: {
  //       OrderInfo: {
  //         Restaurant: {
  //           details: {
  //             res_name: 'jj foods',
  //             address: '2nd Floor, Reliance Mall, Nr.Akshar Chowk',
  //             contact_information: '9427846660',
  //             restID: "pt90esg5",
  //           },
  //         },
  //         Customer: {
  //           details: {
  //             email: getSafeValue(order.user?.emailId),
  //             name: getSafeValue(order.user?.name),
  //             address: `${getSafeValue(order.address?.address1)}, ${getSafeValue(order.address?.address2)}, ${getSafeValue(order.address?.address3)}`,
  //             phone: getSafeValue(order.user?.phoneNumber),
  //             latitude: '34.11752681212772',// order?.address?.latitude,
  //             longitude: '74.72949172653219',//order?address?.longitude
  //           },
  //         },
  //         Order: {
  //           details: {
  //             orderID: order.id,
  //             preorder_time: getSafeValue(order.preOrder?.orderTime) ? this.convertTo24HourFormat(order.preOrder?.orderTime) : this.getCurrentTime(),
  //             preorder_date: getSafeValue(order.preOrder?.orderDate) ? getSafeValue(order.preOrder?.orderDate) : this.getCurrentDate(),
  //             service_charge: '0',
  //             sc_tax_amount: '0',
  //             delivery_charges: getSafeValue(order.deliveryFee, '0'),
  //             dc_tax_amount: getSafeValue(order.sgst, '0'),
  //             dc_gst_details: [
  //               {
  //                 gst_liable: 'vendor',
  //                 amount: getSafeValue(order.sgst, '0'),
  //               },
  //               {
  //                 gst_liable: 'restaurant',
  //                 amount: '0',
  //               },
  //             ],
  //             packing_charges: getSafeValue(order.platformFee, '0'),
  //             pc_tax_amount: getSafeValue(order.cgst, '0'),
  //             pc_gst_details: [
  //               {
  //                 gst_liable: 'vendor',
  //                 amount: getSafeValue(order.cgst, '0'),
  //               },
  //               {
  //                 gst_liable: 'restaurant',
  //                 amount: '0',
  //               },
  //             ],
  //             order_type: order.orderPreference === 'delivery' ? 'D' : 'H',
  //             ondc_bap: 'JJFOODS',
  //             advanced_order: 'N',
  //             payment_type: order.payment?.paymentMethod === 'credit_card' ? 'Online' : 'COD',
  //             table_no: '',
  //             no_of_persons: '0',
  //             discount_total: getSafeValue(order.discount?.discount, '0'),
  //             tax_total: getSafeValue(order.cgst + order.sgst, '0'),
  //             discount_type: 'F',// dynamic
  //             total: getSafeValue(order.grandTotal, '0'),
  //             description: '',
  //             created_on: new Date(order.createdAt).toISOString(),
  //             enable_delivery: order.orderPreference === 'delivery' ? 1 : 0,
  //             min_prep_time: 20,
  //             callback_url: this.configService.get<string>('WEBHOOKURL'),
  //             collect_cash: getSafeValue(order.grandTotal, '0'),
  //             otp: '9876',
  //           },
  //         },
  //         OrderItem: {
  //           details: order.products.map((product) => ({
  //             id: getSafeValue(product.itemId),
  //             name: 'Product Name',
  //             gst_liability: 'vendor',
  //             item_tax: [
  //               {
  //                 id: '11213',
  //                 name: 'CGST',
  //                 amount: getSafeValue((parseFloat(product.price) * 0.025).toFixed(2)),
  //               },
  //               {
  //                 id: '20375',
  //                 name: 'SGST',
  //                 amount: getSafeValue((parseFloat(product.price) * 0.025).toFixed(2)),
  //               },
  //             ],
  //             item_discount: '0',
  //             price: getSafeValue(product.price),
  //             final_price: getSafeValue((parseFloat(product.price) * product.quantity).toString()),
  //             quantity: getSafeValue(product.quantity),
  //             description: '',
  //             variation_name: '',
  //             variation_id: '',
  //             AddonItem: {
  //               details: [],
  //             },
  //           })),
  //         },
  //         Tax: {
  //           details: [
  //             {
  //               id: '11213',
  //               title: 'CGST',
  //               type: 'P',
  //               price: '2.5',
  //               tax: '5.9',
  //               restaurant_liable_amt: '0.00',
  //             },
  //             {
  //               id: '20375',
  //               title: 'SGST',
  //               type: 'P',
  //               price: '2.5',
  //               tax: '5.9',
  //               restaurant_liable_amt: '0.00',
  //             },
  //             {
  //               id: '21866',
  //               title: 'CGST',
  //               type: 'P',
  //               price: '9',
  //               tax: '25.11',
  //               restaurant_liable_amt: '25.11',
  //             },
  //             {
  //               id: '21867',
  //               title: 'SGST',
  //               type: 'P',
  //               price: '9',
  //               tax: '25.11',
  //               restaurant_liable_amt: '25.11',
  //             },
  //           ],
  //         },
  //         Discount: {
  //           details: [
  //             {
  //               id: '362',//dynamic
  //               title: 'Discount',
  //               type: 'F',//dynamic
  //               price: getSafeValue(order.discount?.discount, '0'),
  //             },
  //           ],
  //         },
  //       },
  //       udid: '',
  //       device_type: 'Web',
  //     },
  //   };
  // }



}
