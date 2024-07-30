import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { Feedback } from './schemas/feedback.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import { RatingOrder } from './schemas/ratingOrder.schema';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(RatingOrder.name) private ratingOrderModel: Model<RatingOrder>,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService

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

  async findAll() {
    return this.ratingOrderModel.find()
  }

  async findOne(id) {
    return this.ratingOrderModel.findById(id)

  }
}
