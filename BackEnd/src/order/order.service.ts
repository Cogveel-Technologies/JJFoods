import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import mongoose, { Connection, Model } from 'mongoose';
import { Cart } from 'src/cart/schemas/cart.schema';
import { CartService } from 'src/cart/cart.service';
import { Coupon } from 'src/coupon/schemas/coupon.schema';
import { CouponService } from 'src/coupon/coupon.service';
import { User } from 'src/auth/schemas/user.schema';
import { Address } from 'src/auth/schemas/address.schema';
import { PetPoojaService } from 'src/pet-pooja/pet-pooja.service';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { ConfigService } from '@nestjs/config';
import { FeedbackService } from 'src/feedback/feedback.service';
import { Used } from 'src/coupon/schemas/used.schema';
import { Discrepancy } from 'src/pet-pooja/schemas/stock.schema';
import { Fees, FeesDocument } from './schemas/fees.schema';
import { MenuCT } from 'src/menu/schema/menu.schema';
import { CategoryCT } from 'src/menu/schema/categoryct.schema';
import { RestaurantDetails } from 'src/auth/schemas/restaurant.schema';
import { NotificationService } from '../notification/notification.service';


const { ObjectId } = require('mongodb');

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>, @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>, @InjectModel(Address.name) private addressModel: Model<Address>,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @Inject(CouponService)
    private readonly couponService: CouponService,
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => PetPoojaService))
    private readonly petPoojaService: PetPoojaService,
    @Inject(RazorpayService) private readonly razorpayService: RazorpayService,
    private configService: ConfigService,
    @InjectConnection() private connection: Connection,
    @Inject(forwardRef(() => FeedbackService)) private feedbackService: FeedbackService,
    @InjectModel(Used.name) private readonly usedModel: Model<Used>,
    @InjectModel(Discrepancy.name) private discrepancyModel: Model<Discrepancy>,
    @InjectModel(Fees.name) private feeModel: Model<Fees>,
    @InjectModel(MenuCT.name) private menuCTModel: Model<MenuCT>,
    @InjectModel(CategoryCT.name) private categoryCTModel: Model<CategoryCT>,
    @InjectModel(RestaurantDetails.name) private restaurantDetailsModel: Model<RestaurantDetails>

  ) { }

  async setFee(body) {
    const { deliveryFee, platformFee } = body;
    const feeDocument = await this.feeModel.findOne();

    if (feeDocument) {
      await this.feeModel.findOneAndUpdate(
        { _id: feeDocument._id },
        { $set: { deliveryFee, platformFee } }
      );
    } else {
      const fee = new this.feeModel({ deliveryFee, platformFee });
      await fee.save();
    }

    return { message: "done" };
  }

  async processOrderStatusUpdate(data: any) {
    const {
      restID,
      orderID,
      status,
      cancel_reason,
      minimum_prep_time,
      minimum_delivery_time,
      rider_name,
      rider_phone_number,
      is_modified
    } = data;

    // Determine the state based on the status value
    let state: string;
    switch (status) {
      case -1:
        state = 'rejected';
        break;
      case 1:
      case 2:
      case 3:
        state = 'processing';
        break;
      case 4:
        state = 'on the way';
        break;
      case 5:
        state = 'ready';
        break;
      case 10:
        state = 'completed';
        break;
      default:
        throw new Error(`Unknown status value: ${status}`);
    }

    // Update the petPooja fields and the state in your database
    await this.orderModel.updateOne(
      { 'petPooja.orderId': orderID, 'petPooja.restId': restID },
      {
        $set: {
          'petPooja.status': status,
          'petPooja.cancel_reason': cancel_reason,
          'petPooja.minimum_prep_time': minimum_prep_time,
          'petPooja.minimum_delivery_time': minimum_delivery_time,
          'petPooja.rider_name': rider_name,
          'petPooja.rider_phone_number': rider_phone_number,
          'petPooja.is_modified': is_modified,
          state: state
        }
      }
    ).exec();

    // Check if cancelled, then refund
    if (state == 'rejected') {
      const order = await this.orderModel.findOne({ 'petPooja.orderId': orderID });

      if (order?.discount?.couponId) {
        await this.usedModel.deleteOne({ code: order.discount.couponId, user: order.user });
        await this.couponModel.findOneAndUpdate(
          { _id: order.discount.couponId },
          { $inc: { usageLimit: 1 } },
          { new: true }
        );

      }

      if (order.payment.paymentMethod == 'online' && order.payment.status == true) {
        await this.razorpayService.refund(order._id);
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const restaurantDetails = await this.restaurantDetailsModel.findOne()
      const menu = restaurantDetails.menu;
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
        })
      }
      if (!discrepancy) {
        throw new Error('No stock information available');
      }

      // Iterate over the products in the order and update the used field
      for (let i = 0; i < order.products.length; i++) {
        const product = order.products[i];
        const stockItem = discrepancy.stockItems.find(item => item.itemId === product.itemId);

        if (stockItem) {
          stockItem.used -= product.quantity;
          if (stockItem.used < 0) {
            stockItem.used = 0; // Ensure used doesn't go below 0
          }
        }
      }

      // Mark the stockItems array as modified and save the discrepancy document
      discrepancy.markModified('stockItems');
      await discrepancy.save();

    }




    return {
      message: "success"
    }
  }


  //admin

  // async getAdminOrdersByState(state) {



  //   let queryStates;
  //   if (state === 'Processing') {
  //     queryStates = ['processing'];
  //   }
  //   else if (state == 'OnTheWay') {
  //     queryStates = ['ready', 'on the way']
  //   }
  //   else if (state == 'Pending') {
  //     queryStates = ['pending']
  //   } else if (state === 'Completed') {
  //     queryStates = ['completed'];
  //   }
  //   else if (state == 'Cancelled') {
  //     queryStates = ['cancelled']
  //   } else {
  //     // If the state doesn't match 'running' or 'history', return an empty array or handle accordingly
  //     return [];
  //   }

  //   // Query the database with the mapped states
  //   const orders = await this.orderModel.find({ state: { $in: queryStates } }).exec();
  //   // return response;
  //   for (const order of orders) {



  //     const addressComplete = await this.addressModel.findOne({ _id: order.address })
  //     const userDetails = await this.userModel.findOne({ _id: order.user })
  //     console.log(order.address, addressComplete)
  //     if (userDetails) {
  //       order.user = userDetails;
  //     }
  //     if (addressComplete) {
  //       order.address = addressComplete
  //     }
  //     for (const product of order.products) {

  //       const item = await this.connection.db.collection('items').findOne({ itemid: product.itemId });


  //       if (item) {
  //         product.details = item

  //       }
  //       // const rating = await this.feedbackService.getOrderItemRating({ orderId: order._id, itemId: product.itemId })
  //       // console.log(rating)
  //       // if (rating) {
  //       //   product.details.rating = rating;
  //       // } else {
  //       //   product.details.rating = 0
  //       // }


  //     }
  //   }
  //   // console.log(orders)
  //   return orders;
  // }
  async getAdminOrdersByState(state, orderType) {
    let queryStates;

    switch (state) {
      case 'Processing':
        queryStates = ['processing'];
        break;
      case 'OnTheWay':
        queryStates = ['ready', 'on the way'];
        break;
      case 'Pending':
        queryStates = ['pending'];
        break;
      case 'Completed':
        queryStates = ['completed'];
        break;
      case 'Cancelled':
        queryStates = ['cancelled', 'rejected'];
        break;
      default:
        return [];
    }

    const orders = await this.orderModel.find({ state: { $in: queryStates } }).exec();

    const addressIds = orders.map(order => order.address);
    const userIds = orders.map(order => order.user);
    const productIds = orders.flatMap(order => order.products.map(product => product.itemId));

    const [addresses, users, items] = await Promise.all([
      this.addressModel.find({ _id: { $in: addressIds } }).exec(),
      this.userModel.find({ _id: { $in: userIds } }).exec(),
      this.connection.db.collection('items').find({ itemid: { $in: productIds } }).toArray()
    ]);

    const addressMap = Object.fromEntries(addresses.map(address => [address._id, address]));
    const userMap = Object.fromEntries(users.map(user => [user._id, user]));
    const itemMap = Object.fromEntries(items.map(item => [item.itemid, item]));

    orders.forEach(order => {
      order.address = addressMap[order?.address?.toString()];
      order.user = userMap[order?.user?.toString()];

      order.products.forEach(product => {
        product.details = itemMap[product.itemId];
      });
    });


    const response = orders.filter((order) => {
      return `${order.preOrder.type}` == orderType;
    })
    // console.log(response)
    return response;
  }

  async findOrdersByTimePeriod(period: 'today' | 'week' | 'month') {
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // set to the beginning of the day
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // set to the end of the day
        break;
      case 'week':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // set to the beginning of the day
        startDate.setDate(startDate.getDate() - 7); // get the date 7 days ago
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // set to the end of the current day
        break;
      case 'month':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // set to the beginning of the day
        startDate.setDate(startDate.getDate() - 31); // get the date 31 days ago
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // set to the end of the current day
        break;
      default:
        throw new Error('Invalid time period');
    }

    // Count orders by their states
    const onDeliveryCount = await this.orderModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      state: { $in: ['pending', 'processing', 'ready', 'on the way'] }
    }).exec();



    const completedCount = await this.orderModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      state: 'completed'
    }).exec();

    const cancelledCount = await this.orderModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      state: { $in: ['cancelled', 'rejected'] }

    }).exec();

    startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // set to the beginning of the day
    endDate = new Date();
    endDate.setHours(23, 59, 59, 999)

    const todaysOrders = await this.orderModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      state: { $in: ['pending', 'processing', 'ready', 'on the way'] }
    }).exec();

    const obj = {
      todaysOrders,
      data: [
        { value: onDeliveryCount, label: "On Delivery", id: 0, color: "#2A1A0B" },
        { value: completedCount, label: "Delivered", id: 1, color: "#B76F00" },
        { value: cancelledCount, label: "Cancelled", id: 2, color: "#999898" }
      ]
    };

    return obj
  }
  async getDetails() {

    const totalOrdersArr = await this.orderModel.find();

    const totalOrders = totalOrdersArr.length;


    const completedOrdersArr = await this.orderModel.find({ state: 'completed' }).exec();
    const completedOrders = completedOrdersArr.length
    const revenue = (completedOrdersArr.reduce((sum, order) => sum + order.grandTotal, 0)) / 1000;
    const customersArr = await this.userModel.find({ isActive: true })
    const customers = customersArr.length;
    const revenueGraph = await this.getRevenueGraph();
    const orderData = [{ data: totalOrders, title: "Orders", id: 0 }, { data: revenue, title: "Revenue", id: 1 }, { data: customers, title: "Customers", id: 2 }, { data: completedOrders, title: "Completed \nOrders", id: 3 }]
    const todayData = await this.findOrdersByTimePeriod('today')

    return { orderData, revenueGraph, todayData: todayData.data, todaysOrders: todayData.todaysOrders }
  }
  async getRevenueGraph() {
    // const orders = await this.orderModel.find({ state: 'completed' }).exec();
    const currentYear = new Date().getFullYear();

    const orders = await this.orderModel.find({
      state: 'completed',
      createdAt: { $gte: new Date(`${currentYear}-01-01`), $lt: new Date(`${currentYear + 1}-01-01`) }
    }).exec();

    const monthlyRevenue = Array(12).fill(0);

    orders.forEach(order => {
      const month = new Date(order.createdAt).getMonth();
      monthlyRevenue[month] += order.grandTotal;
    });

    const data = [
      { value: monthlyRevenue[0] / 1000, label: 'Jan' },
      { value: monthlyRevenue[1] / 1000, label: 'Feb' },
      { value: monthlyRevenue[2] / 1000, label: 'Mar' },
      { value: monthlyRevenue[3] / 1000, label: 'Apr' },
      { value: monthlyRevenue[4] / 1000, label: 'May' },
      { value: monthlyRevenue[5] / 1000, label: 'Jun' },
      { value: monthlyRevenue[6] / 1000, label: 'Jul' },
      { value: monthlyRevenue[7] / 1000, label: 'Aug' },
      { value: monthlyRevenue[8] / 1000, label: 'Sep' },
      { value: monthlyRevenue[9] / 1000, label: 'Oct' },
      { value: monthlyRevenue[10] / 1000, label: 'Nov' },
      { value: monthlyRevenue[11] / 1000, label: 'Dec' },
    ];

    return data;
  }
  async createOrder(body) {
    const { userId, orderPreference } = body;
    if (!userId) {
      // console.log("user id not found")
      return { message: "error" }
    }
    const { couponId } = body.discount;

    const { type, orderDate, orderTime } = body.preOrder;

    // const userCartDocument = await this.cartModel.findOne({ user: userId })
    const FeesDocument = await this.feeModel.findOne()

    // let deliveryFee = FeesDocument?.deliveryFee || 0;
    let deliveryFee;
    deliveryFee = (orderPreference == 'Deliver to my Address') ? FeesDocument?.deliveryFee : 0;
    const platformFee = FeesDocument?.platformFee || 0;



    let discount = 0;

    if (couponId) {
      const data = await this.cartService.getUserCart(userId, undefined)
      const discountBody = {
        couponId,
        userId,
        price: data.itemsTotal,
        toApply: true
      }
      const userCart = await this.couponService.decreaseUsage(discountBody)

      discount = userCart.discount
    }
    // console.log("discount--------------------", discount)


    const data = {
      discount,
      deliveryFee
    }



    const userCart = await this.cartService.getUserCart(userId, data);

    /// inventory
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const restaurantDetails = await this.restaurantDetailsModel.findOne()
    const menu = restaurantDetails.menu;
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
      throw new Error('No stock information available');
    }






    // const products = userCart?.newData?.map((item) => {

    //   // const stock = await this.stockModel.findOne({ itemId: item.itemid });
    //   // if (stock) {
    //   //   stock.used = stock.used - item['quantity'];
    //   //  await  stock.save()
    //   // }





    //   return {
    //     itemId: item['itemid'],
    //     quantity: item['quantity'],
    //     price: item['price']
    //   }
    // })
    const products = await Promise.all(userCart?.newData?.map(async (item) => {
      // const stock = await this.stockModel.findOne({ itemId: item.itemid });
      // if (stock) {
      //   stock.used = stock.used - item['quantity'];
      //   await stock.save();
      // }
      const stock = discrepancy.stockItems.find(stockItem => stockItem.itemId === item['itemid']);


      ///////////check here


      if (stock) {
        if (stock.quantity - stock.used < item.quantity) {
          throw new Error('Insufficient stock');
        }
        stock.used += item['quantity'];
      }

      return {
        itemId: item['itemid'],
        quantity: item['quantity'],
        price: item['price']
      };
    }));
    discrepancy.markModified('stockItems');
    await discrepancy.save()
    let order: any;


    const orderBody = {
      user: userId,
      products,
      cgst: userCart?.cgst,
      sgst: userCart?.sgst,
      discount: {
        couponId,
        discount: discount
      },
      itemsTotal: userCart?.itemsTotal,
      // grandTotal: userCart?.grandTotal?.toFixed(2),
      grandTotal: userCart?.grandTotal ? Math.round(userCart.grandTotal) : undefined,
      deliveryFee: userCart?.deliveryFee,
      platformFee: FeesDocument?.platformFee || 0,
      orderPreference,
      address: body.address ? body.address : undefined,

      payment: {
        paymentMethod: body.payment.paymentMethod,
        paymentId: body.payment?.paymentId,
        status: false
      },
      preOrder: {
        type,
        orderDate,
        orderTime
      },
      createdAt: new Date(),
      updatedAt: new Date()


    }

    const petPoojaOrderBody = {
      user: await this.userModel.findOne({ _id: userId }),
      products,
      cgst: userCart?.cgst,
      sgst: userCart?.sgst,
      discount: {
        couponId,
        discount: discount
      },
      itemsTotal: userCart?.itemsTotal,
      grandTotal: userCart?.grandTotal.toFixed(2),
      deliveryFee: userCart?.deliveryFee,
      platformFee,
      orderPreference,
      address: body.address ? await this.addressModel.findOne({ _id: body.address }) : undefined,

      payment: {
        paymentMethod: body.payment.paymentMethod,
        paymentId: body.payment?.paymentId,
        status: false
      },
      preOrder: {
        type,
        orderDate,
        orderTime
      },
      createdAt: new Date(),
      updatedAt: new Date()


    }
    // console.log("ppob", petPoojaOrderBody)
    if (orderBody.payment.paymentMethod === 'online') {
      order = new this.orderModel(orderBody);
      await order.save();
    }
    else {

      // make order only after admin accepts

      // const petPoojaOrder = await this.petPoojaService.saveOrder(petPoojaOrderBody)

      // console.log(petPoojaOrder.restID)


      // const newOrderBody = { ...orderBody, petPooja: { restId: petPoojaOrder.restID, orderId: petPoojaOrder.orderID, clientOrderId: petPoojaOrder.clientOrderID } }



      order = new this.orderModel(orderBody);
      await order.save();

    }

    if (order.payment.paymentMethod === "online") {


      const razorpayBody = {
        amount: orderBody.grandTotal,
        currency: 'INR',
        receipt: "food",
        orderId: order._id
        //check if salt we can send
      }

      const razorpay = await this.razorpayService.payment(razorpayBody);
      // console.log("create order razorpay", razorpay)

      order.payment.orderId = razorpay.id;
      await order.save()

      const user = await this.userModel.findById(userId)

      return {
        order: order._id,
        key: this.configService.get<string>('RAZORPAY_ID'),
        // amount: parseFloat(orderBody.grandTotal),
        amount: orderBody.grandTotal,
        name: "JJFOODS",
        description: "wazwan",
        currency: "INR",
        order_id: razorpay.id,
        prefill: {
          email: user.emailId,
          contact: user.phoneNumber,
          name: user.name
        }


      }
    }
    else {
      await this.cartService.removeCart({ userId: order.user });
      await this.notificationService.newOrder()


      return order
    }

  }
  async getAllOrders() {
    return await this.orderModel.find()
  }
  async updateOrderStateCancelled(orderId) {
    //cancel only when state is pending
    const order = await this.orderModel.findById(orderId);
    if (order.state != 'pending') {

      throw new HttpException('Order cannot be cancelled', HttpStatus.BAD_REQUEST)
    }

    await this.orderModel.findByIdAndUpdate(orderId, { state: "cancelled", updatedAt: Date.now() }, { new: true }).exec();


    //if online paymentd done, refund
    // console.log("before")
    if (order?.payment?.paymentMethod == 'online' && order.payment.status == true) {
      // console.log("inside")
      await this.razorpayService.refund(orderId);
    }
    // console.log("after")
    if (order?.discount?.couponId) {
      await this.usedModel.deleteOne({ code: order.discount.couponId, user: order.user });
      await this.couponModel.findOneAndUpdate(
        { _id: order.discount.couponId },
        { $inc: { usageLimit: 1 } },
        { new: true }
      );

    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the most recent discrepancy document (or today's document if it exists)
    const restaurantDetails = await this.restaurantDetailsModel.findOne();


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
      throw new Error('No stock information available');
    }

    // Iterate over the products in the order and update the used field
    for (let i = 0; i < order.products.length; i++) {
      const product = order.products[i];
      const stockItem = discrepancy.stockItems.find(item => item.itemId === product.itemId);

      if (stockItem) {
        stockItem.used -= product.quantity;
        if (stockItem.used < 0) {
          stockItem.used = 0; // Ensure used doesn't go below 0
        }
      }
    }

    // Mark the stockItems array as modified and save the discrepancy document
    discrepancy.markModified('stockItems');
    await discrepancy.save();




    return {
      message: "success"
    }



  }

  async updateOrderState(orderId: string, newState) {
    const order = await this.orderModel.findOne({ _id: orderId });
    let stateShow = order.state;
    // if (newState == 'OnTheWay') {
    //   newState = 'on the way';
    // }
    let orderType = order.preOrder.type;

    await this.orderModel.findByIdAndUpdate(orderId, { state: newState, updatedAt: Date.now() }, { new: true }).exec();
    const map = {
      "pending": "Pending",
      "processing": "Processing",
      "cancelled": "Cancelled",
      "completed": "Completed",
      "ready": "OnTheWay",
      "on the way": "OnTheWay"
    }


    return await this.getAdminOrdersByState(map[stateShow], orderType)
    // return this.getAllOrders()
  }

  async updateOrderStatePending(orderId: string, state) {
    const restaurantDetails = await this.restaurantDetailsModel.findOne();

    let menu = restaurantDetails.menu;

    if (state == 'cancelled') {
      const order = await this.orderModel.findByIdAndUpdate(orderId, { state: "rejected", updatedAt: Date.now() }, { new: true }).exec();

      // refund, if online paid
      if (order?.payment?.paymentMethod == 'online' && order.payment.status == true) {
        await this.razorpayService.refund(orderId);
      }

      if (order?.discount?.couponId) {
        await this.usedModel.deleteOne({ code: order.discount.couponId, user: order.user });
        await this.couponModel.findOneAndUpdate(
          { _id: order.discount.couponId },
          { $inc: { usageLimit: 1 } },
          { new: true }
        );

      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const restaurantDetails = await this.restaurantDetailsModel.findOne();

      let menu = restaurantDetails.menu;


      // Find the most recent discrepancy document (or today's document if it exists)
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
        throw new Error('No stock information available');
      }

      // Iterate over the products in the order and update the used field
      for (let i = 0; i < order.products.length; i++) {
        const product = order.products[i];
        const stockItem = discrepancy.stockItems.find(item => item.itemId === product.itemId);

        if (stockItem) {
          stockItem.used -= product.quantity;
          if (stockItem.used < 0) {
            stockItem.used = 0; // Ensure used doesn't go below 0
          }
        }
      }

      // Mark the stockItems array as modified and save the discrepancy document
      discrepancy.markModified('stockItems');
      await discrepancy.save();

      await this.notificationService.orderRejected(order.user)





    }
    else {




      const order = await this.orderModel.findByIdAndUpdate(orderId, { state: "processing", updatedAt: Date.now() }, { new: true }).exec();
      await this.notificationService.orderAccepted(order.user)

      if (menu == 'petpooja') {
        const petPoojaOrderBody = {
          user: await this.userModel.findOne({ _id: order.user }),
          products: order.products,
          cgst: order.cgst,
          sgst: order.sgst,
          discount: {
            couponId: order.discount.couponId,
            discount: order.discount.discount
          },
          itemsTotal: order.itemsTotal,
          grandTotal: order.grandTotal,
          deliveryFee: order.deliveryFee,
          platformFee: 15,
          orderPreference: order.orderPreference,
          address: order.address ? await this.addressModel.findOne({ _id: order.address }) : undefined,

          payment: {
            paymentMethod: order.payment.paymentMethod,
            paymentId: order.payment.paymentId,
            status: order.payment.status
          },
          preOrder: {
            type: order.preOrder.type,
            orderDate: order.preOrder.orderDate,
            orderTime: order.preOrder.orderTime
          },
          createdAt: order.createdAt,
          updatedAt: new Date()
        };

        const petPoojaOrder = await this.petPoojaService.saveOrder(petPoojaOrderBody);

        await this.orderModel.findByIdAndUpdate(orderId, {
          petPooja: { restId: petPoojaOrder.restID, orderId: petPoojaOrder.orderID, clientOrderId: petPoojaOrder.clientOrderID },
          updatedAt: Date.now()
        }, { new: true }).exec();
      }
    }

    const order = await this.orderModel.findOne({ _id: orderId });

    let orderType = order.preOrder?.type;


    return await this.getAdminOrdersByState("Pending", orderType)



    // const order = await this.orderModel.findByIdAndUpdate(orderId, { state: "processing", updatedAt: Date.now() }, { new: true }).exec();

    // //petpooja
    // const petPoojaOrder = await this.petPoojaService.saveOrder(petPoojaOrderBody)

    //   // console.log(petPoojaOrder.restID)


    //   const newOrderBody = { ...orderBody, petPooja: { restId: petPoojaOrder.restID, orderId: petPoojaOrder.orderID, clientOrderId: petPoojaOrder.clientOrderID } }



    //   order = new this.orderModel(newOrderBody);
    //   await order.save();


  }

  // async updateOrderStatus(orderId: string, newStatus: string) {
  //   return this.orderModel.findByIdAndUpdate(orderId, { status: newStatus, updatedAt: Date.now() }, { new: true }).exec();
  // }

  async getOrdersByCustomerId(userId, state) {
    // const response = await this.orderModel.find({ user: userId, state: state }).exec();
    // return response;
    await this.orderModel.updateMany(
      { "payment.paymentMethod": "online", "payment.status": false, user: userId },
      { $set: { state: "cancelled" } }
    );
    // console.log("123")

    let queryStates;
    if (state === 'running') {
      queryStates = ['processing', 'ready', 'on the way', 'pending'];
    } else if (state === 'history') {
      queryStates = ['completed', 'cancelled', 'rejected'];
    } else {
      // If the state doesn't match 'running' or 'history', return an empty array or handle accordingly
      return [];
    }
    // console.log("456")
    // Query the database with the mapped states
    const orders = await this.orderModel.find({ user: userId, state: { $in: queryStates } }).exec();
    // return response;
    for (const order of orders) {
      if (order?.address) {
        const address = await this.addressModel.findById(order.address);
        order.address = address;
      }

      for (const product of order.products) {
        // console.log("789")

        const item = await this.connection.db.collection('items').findOne({ itemid: product.itemId });
        // console.log(item)
        // console.log("912")


        if (item) {
          product.details = item

        }

        const body = {
          orderId: order._id,
          itemId: product.itemId
        }

        const rating = await this.feedbackService.getOrderItemRating(body)
        // console.log("getorderrating api")
        // console.log(rating)
        if (rating) {
          product.details.rating = rating;
        }
        else {
          product.details.rating = 0
        }
        // console.log(product)

        // console.log("678")

      }
    }
    // console.log(orders)
    return orders;
  }

  async getOrderByCustomerId(user, orderId) {
    // console.log(orderId)


    const order = await this.orderModel.findOne({ _id: orderId });
    // console.log(order)
    for (const product of order.products) {

      const item = await this.connection.db.collection('items').findOne({ itemid: product.itemId });


      if (item) {
        product.details = item

      }
      const rating = await this.feedbackService.getOrderItemRating({ orderId: order._id, itemId: product.itemId })
      // console.log(rating)
      if (rating) {
        product.details.rating = rating;
      } else {
        product.details.rating = 0
      }


    }
    return order;

  }


  async getOrdersByCustomerIdAdmin(user, state) {
    const response = await this.orderModel.find({ user, state }).exec();
    return response;

  }

  async getOrderById(orderId: string) {
    return this.orderModel.findById(orderId).exec();
  }


  async orderAgain(orderId: string) {

    const order = await this.orderModel.findOne({ _id: orderId });
    // {
    //   product: { itemId: string };
    //   userId: string;
    //   quantity: number;
    // }

    for (let i = 0; i < order.products.length; i++) {
      const body = {
        product: { itemId: order.products[i].itemId },
        userId: order.user,
        quantity: order.products[i].quantity
      }

      await this.cartService.addCart(body)

    }
    return {
      message: "added to cart"

    }




  }
}
