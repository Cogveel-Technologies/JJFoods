import { Inject, Injectable, forwardRef } from '@nestjs/common';
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
const { ObjectId } = require('mongodb');

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>, @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>, @InjectModel(Address.name) private addressModel: Model<Address>,
    @Inject(CartService)
    private readonly cartService: CartService,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @Inject(CouponService)
    private readonly couponService: CouponService,
    @Inject(forwardRef(() => PetPoojaService))
    private readonly petPoojaService: PetPoojaService,
    @Inject(RazorpayService) private readonly razorpayService: RazorpayService,
    private configService: ConfigService,
    @InjectConnection() private connection: Connection,
    @Inject(forwardRef(() => FeedbackService)) private feedbackService: FeedbackService,
    @InjectModel(Used.name) private readonly usedModel: Model<Used>
  ) { }

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
        queryStates = ['cancelled'];
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
      state: 'cancelled'
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
    const orders = await this.orderModel.find({ state: 'completed' }).exec();

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
    const deliveryFee = 0;

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
    console.log("discount--------------------", discount)


    const data = {
      discount,
      deliveryFee
    }



    const userCart = await this.cartService.getUserCart(userId, data)


    const products = userCart?.newData?.map((item) => {

      return {
        itemId: item['itemid'],
        quantity: item['quantity'],
        price: item['price']
      }
    })
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
      grandTotal: userCart?.grandTotal?.toFixed(2),
      deliveryFee: userCart?.deliveryFee,
      platformFee: 15,
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
      platformFee: 15,
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

      order.payment.orderId = razorpay.id;
      await order.save()

      const user = await this.userModel.findById(userId)

      return {
        order: order._id,
        key: this.configService.get<string>('RAZORPAY_ID'),
        amount: parseFloat(orderBody.grandTotal),
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
      await this.cartService.removeCart({ userId: order.user })

      return order
    }

  }
  async getAllOrders() {
    return await this.orderModel.find()
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

  async updateOrderStateCod(orderId: string) {
    const order = await this.orderModel.findByIdAndUpdate(orderId, { state: "processing", updatedAt: Date.now() }, { new: true }).exec();

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

    let queryStates;
    if (state === 'running') {
      queryStates = ['processing', 'ready', 'on the way', 'pending'];
    } else if (state === 'history') {
      queryStates = ['completed', 'cancelled'];
    } else {
      // If the state doesn't match 'running' or 'history', return an empty array or handle accordingly
      return [];
    }

    // Query the database with the mapped states
    const orders = await this.orderModel.find({ user: userId, state: { $in: queryStates } }).exec();
    // return response;
    for (const order of orders) {
      for (const product of order.products) {

        const item = await this.connection.db.collection('items').findOne({ itemid: product.itemId });


        if (item) {
          product.details = item

        }
        const rating = await this.feedbackService.getOrderItemRating({ orderId: order._id, itemId: product.itemId })
        console.log(rating)
        if (rating) {
          product.details.rating = rating;
        } else {
          product.details.rating = 0
        }


      }
    }
    console.log(orders)
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
      console.log(rating)
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
}
