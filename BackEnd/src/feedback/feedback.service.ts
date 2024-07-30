import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Feedback } from './schemas/feedback.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import { RatingOrder } from './schemas/ratingOrder.schema';
import { OrderService } from 'src/order/order.service';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(RatingOrder.name) private ratingOrderModel: Model<RatingOrder>,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private userModel: Model<User>


  ) {

  }

  async addReview(body) {
    const review = await new this.reviewModel(body);
    await review.save();
    return review;

  }

  async createOrderItemRating(body) {
    const { orderId } = body
    const newRating = new this.ratingOrderModel({ ...body, user: body.userId, order: body.orderId });
    await newRating.save();

    delete body.orderId
    // console.log("----------------", body)

    await this.createOrUpdateRating(body)
    return await this.orderService.getOrderByCustomerId(body.userId, orderId)

  }

  async getOrderItemRating(body) {

    const rating = await this.ratingOrderModel.findOne({ order: body.orderId, itemId: body.itemId });
    // console.log("feedbackRating", rating)
    if (rating) {

      return rating.rating
    }
    return 0;
  }
  async createOrUpdateRating(body) {

    const existingRating = await this.feedbackModel.findOne({ user: body.userId, itemId: body.itemId });
    if (existingRating) {
      //update
      const updatedRating = await this.feedbackModel.findOneAndUpdate({ user: body.userId, itemId: body.itemId }, { feedback: body.feedback, rating: body.rating }, { new: true });

      return updatedRating;
    }
    else {
      //create
      const newRating = new this.feedbackModel({ ...body, user: body.userId });
      await newRating.save();
      return newRating;
    }


  }

  async getRating(id) {

    const ratingArray = await this.feedbackModel.find({ itemId: id });
    if (ratingArray.length) {
      const sum = ratingArray.reduce((a, b) => a + b.rating, 0);
      let avg = sum / ratingArray.length;
      return avg;
    }
    return 0;

  }
  // async findAll(): Promise<any> {
  //   const feedbacks = await this.ratingOrderModel.find();
  //   let response = [];

  //   for (let i = 0; i < feedbacks.length; i++) {
  //     const user = await this.userModel.findById(feedbacks[i].user);
  //     const itemDetails = await this.connection.collection('items').findOne();
  //     response.push({ ...feedbacks[i].toObject(), user: user, item: itemDetails })

  //   }
  //   return response;
  // }
  async findAll(): Promise<any> {
    try {
      // Fetch all feedbacks
      const feedbacks = await this.ratingOrderModel.find().lean();

      // Collect all user IDs and item IDs from the feedbacks
      const userIds = feedbacks.map(feedback => feedback.user);
      const itemIds = feedbacks.map(feedback => feedback.itemId); // Note: Using itemId here

      // Fetch all users and items in parallel
      const [users, items] = await Promise.all([
        this.userModel.find({ _id: { $in: userIds } }).lean(),
        this.connection.collection('items').find({ itemid: { $in: itemIds } }).toArray() // Note: Using itemid here
      ]);

      // Create lookup maps for fast access
      const userMap = new Map(users.map(user => [user._id.toString(), user]));
      const itemMap = new Map(items.map(item => [item.itemid, item])); // Note: Using itemid here

      // Construct the response array
      const response = feedbacks.map(feedback => ({
        ...feedback,
        user: userMap.get(feedback.user.toString()) || null,
        item: itemMap.get(feedback.itemId) || null // Note: Using itemId here
      }));

      return response;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }








  async findOne(id) {
    return this.ratingOrderModel.findById(id)

  }
}
