import { Module, forwardRef } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackSchema } from './schemas/feedback.schema';
import { ReviewSchema } from './schemas/review.schema';
import { RatingOrderSchema } from './schemas/ratingOrder.schema';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, {
    name: 'Feedback', schema: FeedbackSchema
  }, {
    name: 'Review', schema: ReviewSchema
  }, { name: 'RatingOrder', schema: RatingOrderSchema }, { name: User.name, schema: UserSchema }]), forwardRef(() => OrderModule)],
  providers: [FeedbackService],
  controllers: [FeedbackController],
  exports: [FeedbackService]
})
export class FeedbackModule { }
