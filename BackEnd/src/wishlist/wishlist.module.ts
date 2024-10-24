import { Module, forwardRef } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/schemas/user.schema';
import { WishlistSchema } from './schemas/wishlist.schema';
import { PetPoojaModule } from 'src/pet-pooja/pet-pooja.module';
import { FeedbackSchema } from 'src/feedback/schemas/feedback.schema';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { CartModule } from 'src/cart/cart.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, {
    name: 'Wishlist', schema: WishlistSchema
  }, { name: "Feedback", schema: FeedbackSchema }]), forwardRef(() => PetPoojaModule), forwardRef(() => FeedbackModule), forwardRef(() => CartModule)],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService]
})
export class WishlistModule { }
