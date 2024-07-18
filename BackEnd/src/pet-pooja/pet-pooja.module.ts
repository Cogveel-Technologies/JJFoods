import { Module, forwardRef } from '@nestjs/common';
import { PetPoojaController } from './pet-pooja.controller';
import { PetPoojaService } from './pet-pooja.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistSchema } from 'src/wishlist/schemas/wishlist.schema';
import { WishlistModule } from 'src/wishlist/wishlist.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { FeedbackSchema } from 'src/feedback/schemas/feedback.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminSchema } from 'src/auth/schemas/admin.schema';
import { RestaurantDetails, RestaurantDetailsSchema } from 'src/auth/schemas/restaurant.schema';
import { Discrepancy, DiscrepancySchema, StockItem, StockItemSchema } from './schemas/stock.schema';




@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: 'Wishlist', schema: WishlistSchema }, { name: 'Feedback', schema: FeedbackSchema }, { name: 'Admin', schema: AdminSchema }, { name: RestaurantDetails.name, schema: RestaurantDetailsSchema }, { name: Discrepancy.name, schema: DiscrepancySchema }, { name: StockItem.name, schema: StockItemSchema }]), forwardRef(() => WishlistModule), forwardRef(() => FeedbackModule)],
  controllers: [PetPoojaController],
  providers: [PetPoojaService],
  exports: [PetPoojaService]
})
export class PetPoojaModule { }
