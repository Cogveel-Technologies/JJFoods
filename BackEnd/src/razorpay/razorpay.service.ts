import { Inject, Injectable, ParseFloatPipe, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Salt } from './schemas/salt.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/order/schemas/order.schema';
import { ConfigService } from '@nestjs/config';
import { PetPoojaService } from 'src/pet-pooja/pet-pooja.service';
import { CartService } from 'src/cart/cart.service';
import { Discrepancy } from 'src/pet-pooja/schemas/stock.schema';
import { RestaurantDetails } from 'src/auth/schemas/restaurant.schema';
import { NotificationService } from 'src/notification/notification.service';
var Razorpay = require('razorpay')

@Injectable()
export class RazorpayService {
  constructor(@InjectModel(Salt.name) private saltModel: Model<Salt>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private configService: ConfigService,
    @InjectModel(Discrepancy.name) private discrepancyModel: Model<Discrepancy>,
    @Inject(forwardRef(() => PetPoojaService)) private readonly petPoojaService: PetPoojaService,
    @Inject(CartService) private readonly cartService: CartService,
    @InjectModel(RestaurantDetails.name) private restaurantDetailsModel: Model<RestaurantDetails>,
    @Inject(NotificationService) private readonly notificationService: NotificationService,) { }

  async payment(body) {
    // console.log("razorpay body", body)
    const razorpay = await new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET'),
    });

    // console.log("razorpay key object", razorpay)



    const { amount, currency, receipt, orderId } = body
    // return body;
    try {

      const amt = parseFloat(amount)
      // console.log(amt, "0000000000000000000")
      // console.log(parseFloat(amount) * 100, "111111111111111111")
      // console.log("before")
      const order = await razorpay.orders.create({
        amount: Math.round(parseFloat(amount) * 100),

        currency,
        receipt,
      });
      // console.log("after")

      // console.log("razorpay order create", order)

      //hashing 
      const saltOrRounds = 10;
      const password = parseFloat(amount) + orderId;
      const hash = await bcrypt.hash(password, saltOrRounds);

      const salt = await bcrypt.genSalt();
      // console.log("salt", salt)

      const saltDbItem = new this.saltModel({ orderId, salt: hash })
      await saltDbItem.save()




      return order
    } catch (error) {

      throw new Error(error)
    }
  };

  async fetchPaymentById(body) {
    // console.log("fetch payment is called-----------------------------------", body)


    // console.log("fetch payment by id body", body)
    var instance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET'),
    })
    // return await instance.payments.fetch(body.rPaymentId)

    const { orderId, rSignature, rOrderId } = body
    const saltSaved = await this.saltModel.findOne({ orderId: body.orderId })
    const saltOrRounds = 10;
    const order = await this.orderModel.findById(body.orderId)
    const password = order.grandTotal + orderId
    // const hash = await bcrypt.hash(password, saltOrRounds);
    // console.log("saltsaved", saltSaved.salt)
    // console.log("hash", hash)

    const isMatch = await bcrypt.compare(password, saltSaved.salt);
    // console.log(isMatch)

    // if (saltSaved.salt !== hash) {
    //   throw new Error('Invalid Password 1')
    // }sage: 'error' }

    // }
    if (!isMatch) {
      throw new Error('Invalid Password 2')
    }




    // if (!body.rPaymentId) {
    //   order.state = 'cancelled';
    //   await order.save();
    //   return { mes

    const { rPaymentId } = body



    const razorpayResponse = await instance.payments.fetch(rPaymentId)
    // console.log("razorpay response", razorpayResponse)
    const rPassword = razorpayResponse.amount / 100 + body.orderId;
    const isMatchR = await bcrypt.compare(rPassword, saltSaved.salt);

    if (isMatchR && razorpayResponse.captured) {
      //change payment status
      order.payment.status = true;

      //change order status
      order.state = "pending"

      //save razorpay details in order 
      order.payment.paymentId = rPaymentId
      order.payment.signature = rSignature

      //notify petpooja
      const petPoojaOrderBody = {
        user: order.user,
        products: order.products,
        cgst: order.cgst,
        sgst: order.sgst,
        discount: {
          couponId: order.discount?.couponId,
          discount: order.discount?.discount
        },
        itemsTotal: order.itemsTotal,
        grandTotal: order.grandTotal.toFixed(2),
        deliveryFee: order.deliveryFee,
        platformFee: 15,
        orderPreference: order.orderPreference,
        address: order.address,

        payment: {
          paymentMethod: order.payment.paymentMethod,
          paymentId: rPaymentId,
          status: true
        },
        preOrder: {
          type: order?.preOrder?.type,
          orderDate: order?.preOrder?.orderDate,
          orderTime: order?.preOrder?.orderTime
        },
        createdAt: new Date(),
        updatedAt: new Date()


      }
      const restaurantDetails = await this.restaurantDetailsModel.findOne();
      const menu = restaurantDetails.menu;
      await this.notificationService.newOrder()
      // if (menu == 'petpooja') {
      //   const petPoojaOrder = await this.petPoojaService.saveOrder(petPoojaOrderBody)
      //   // console.log(petPoojaOrder)

      //   // console.log(petPoojaOrder.restID)


      //   // const newOrderBody = { ...orderBody, petPooja: { restId: petPoojaOrder.restID, orderId: petPoojaOrder.orderID, clientOrderId: petPoojaOrder.clientOrderID } }

      //   // order.petPooja.restId = petPoojaOrder?.restID
      //   // order['petPooja'].orderId = petPoojaOrder?.orderID
      //   // order['petPooja'].clientOrderId = petPoojaOrder?.clientOrderID
      //   if (!order.petPooja) {
      //     order['petPooja'] = {
      //       restId: '',
      //       orderId: '',
      //       clientOrderId: ''
      //     };
      //   }

      //   // Assign values to the properties of petPooja

      //   order.petPooja.restId = petPoojaOrder?.restID;
      //   order.petPooja.orderId = petPoojaOrder?.orderID;
      //   order.petPooja.clientOrderId = petPoojaOrder?.clientOrderID;
      // }



      await order.save();

      //cart empty
      await this.cartService.removeCart({ userId: order.user })



      return { message: "done" }


    }

    //change order status
    // order.state = "processing"

    //razorpay 
    //save razorpay details in order 
    order.payment.paymentId = rPaymentId
    order.payment.signature = rSignature
    order.payment.reason = body?.reason

    order.state = "cancelled";

    // stock schema decrease quanitity
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

    await order.save()



    return { error: "error" }

  }


  async handleFailure(body) {
    // console.log("handle failure is called-----------------------------------", body)
    const order = await this.orderModel.findById(body.orderId)
    // console.log(order)


    order.state = "cancelled";

    if (body.rOrderId) {
      order.payment.orderId = body.rOrderId;
      order.payment.paymentId = body.rPaymentId;
      order.payment.signature = body?.rSignature;
      order.payment.reason = body?.reason;
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

    await order.save()
    return { message: "error" }



  }

  async fetchOrderById(body) {
    var instance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET')
    })

    return await instance.orders.fetch(body.orderId)
  }

  async refund(orderId) {
    const order = await this.orderModel.findById(orderId);
    var instance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET'),
    })
    const paymentId = order.payment.paymentId;
    // console.log("inside refund")
    // console.log(paymentId)
    // console.log(Math.round(order.grandTotal * 100))
    const refundResponse = await instance.payments.refund(paymentId, {
      // "amount": Math.round(order.grandTotal * 100),
      "amount": Math.round(order.grandTotal * 100),
      "speed": "optimum",
      // "receipt": "refund 1234"
    })
    // console.log("refund response", refundResponse)
    if (refundResponse?.error) {
      order.payment.refund = false;
    } else {
      order.payment.refund = true;
      order.payment.refundId = refundResponse.id
      order.payment.refundDate = refundResponse.created_at;
      await order.save()
    }
    // const url = 'https://api.razorpay.com/v1/payments/' + paymentId + '/refund';
    // const data = {
    //   "amount": order.grandTotal,
    //   "receipt": "refund",
    //   "notes": {
    //     "notes_key_1": "order refund",
    //     "notes_key_2": "instant refund"
    //   }
    // };





    // // Make the fetch request
    // const response = await fetch(url, {
    //   method: 'POST',

    //   body: JSON.stringify(data),
    // });



    // if (response.ok) {

    //   const responseData = await response.json();
    //   order.payment.refund = true;
    //   await order.save()
    //   return responseData;
    // } else {
    //   // Handle errors
    //   throw new Error('Error making fetch request');
    // }

  }

  async fbpi(id) {
    var instance = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_SECRET'),
    })

    const razorpayResponse = await instance.payments.fetch(id)
    console.log("razorpay response", razorpayResponse)
    return razorpayResponse

  }
}
