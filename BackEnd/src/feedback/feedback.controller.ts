import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AuthGuard } from '@nestjs/passport';
import { ItemRatingDto } from './dtos/itemRating.dto';
import { ReviewDto } from './dtos/review.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {


  }

  @Post('/orderItemRating')
  @UseGuards(AuthGuard('user-jwt'))
  async createOrderItemRating(@Body() body: ItemRatingDto) {
    // console.log("feedback create", body)

    return this.feedbackService.createOrderItemRating(body)
  }

  @Post('/getOrderItemRating')
  @UseGuards(AuthGuard('user-jwt'))
  async getOrderItemRating(@Body() body) {
    // console.log(body)

    return this.feedbackService.getOrderItemRating(body)
  }
  @Get('/:id')
  getRating(@Param('id') id) {

    return this.feedbackService.getRating(id)


  }
  @Post()
  @UseGuards(AuthGuard('user-jwt'))
  createRating(@Body() body) {
    // console.log(body)

    return this.feedbackService.createOrUpdateRating(body)


  }
  @Post('/review')
  @UseGuards(AuthGuard('user-jwt'))
  async addReview(@Body() body: ReviewDto) {
    // console.log(body)

    const review = await this.feedbackService.addReview(body);
    return review

  }
}
