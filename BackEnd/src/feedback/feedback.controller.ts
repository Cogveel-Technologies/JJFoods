import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {


  }

  @Post('/orderItemRating')
  @UseGuards(AuthGuard('user-jwt'))
  async createOrderItemRating(@Body() body) {
    // console.log("feedback create", body)

    return this.feedbackService.createOrderItemRating(body)
  }

  @Post('/getOrderItemRating')
  @UseGuards(AuthGuard('user-jwt'))
  async getOrderItemRating(@Body() body) {

    return this.feedbackService.getOrderItemRating(body)
  }
  @Get('/:id')
  getRating(@Param('id') id) {

    return this.feedbackService.getRating(id)


  }
  @Post()
  @UseGuards(AuthGuard('user-jwt'))
  createRating(@Body() body) {

    return this.feedbackService.createOrUpdateRating(body)


  }
  @Post('/review')
  @UseGuards(AuthGuard('user-jwt'))
  async addReview(@Body() body) {

    const review = await this.feedbackService.addReview(body);
    return review

  }
}
