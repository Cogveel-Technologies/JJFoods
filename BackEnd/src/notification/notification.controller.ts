import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  async sendPushNotificationsToUsers(@Body() body: any) {

    return this.notificationService.sendPushNotificationsToUsers(body)

  }


  // @Get()
  // async send() {
  //   console.log("hello")
  //   return this.notificationService.sendPushNotificationsToUsers({})
  // }
}
