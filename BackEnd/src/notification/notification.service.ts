import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
const admin = require("../utils/firebase/firebaseInit")
@Injectable()
export class NotificationService {
  constructor(@InjectModel(User.name)
  private userModel: Model<User>) {

  }
  bucket = admin.storage().bucket();



  async sendPushNotificationsToUsers(body) {
    // console.log("called")

    try {
      // Fetch all registered drivers
      const users = await this.userModel.find();

      // Collect all driver device tokens
      const deviceTokens = users.map(user => user.deviceToken).filter(Boolean);

      if (deviceTokens.length === 0) {
        throw new Error("no users")
      }

      // Define the notification payload
      const notificationPayload = {
        notification: {
          title: body.title,
          body: body.body,
          // You can add more fields here for customization, such as icons, sounds, etc.
        },
        // Define any data you want to send along with the notification
        data: {
          couponId: body.data, // Include other booking details as needed
        }
      };

      // Send the notification to all device tokens
      const response = await admin.messaging().sendMulticast({
        tokens: deviceTokens,
        ...notificationPayload,
      });



      // Check the response for successes and failures
      // if (response.failureCount > 0) {
      //     console.error('Failed to send notifications to some devices:', response.responses);
      // }

      return ({
        message: 'Push notifications sent successfully',
        response
      });
    } catch (error) {
      console.error(error);
      throw new error("error");
    }
  };

  async sendPushNotificationsToUsers1() {

    try {
      // Fetch all registered drivers
      const users = await this.userModel.find();

      // Collect all driver device tokens
      const deviceTokens = users.map(user => user.deviceToken).filter(Boolean);

      if (deviceTokens.length === 0) {
        throw new Error("no users")
      }

      // Define the notification payload
      const notificationPayload = {
        notification: {
          title: "restaurant closed",
          body: "close",
          // You can add more fields here for customization, such as icons, sounds, etc.
        },
        // Define any data you want to send along with the notification
        data: {
          restarurantStatus: "false", // Include other booking details as needed
        }
      };

      // Send the notification to all device tokens
      const response = await admin.messaging().sendMulticast({
        tokens: deviceTokens,
        ...notificationPayload,
      });



      // Check the response for successes and failures
      // if (response.failureCount > 0) {
      //     console.error('Failed to send notifications to some devices:', response.responses);
      // }

      return ({
        message: 'Push notifications sent successfully',
        response
      });
    } catch (error) {
      console.error(error);
      throw new error("error");
    }
  };

  async sendPushNotificationsToUsers2() {

    try {
      // Fetch all registered drivers
      const users = await this.userModel.find();

      // Collect all driver device tokens
      const deviceTokens = users.map(user => user.deviceToken).filter(Boolean);

      if (deviceTokens.length === 0) {
        throw new Error("no users")
      }

      // Define the notification payload
      const notificationPayload = {
        notification: {
          title: "restaurant opened",
          body: "open",
          // You can add more fields here for customization, such as icons, sounds, etc.
        },
        // Define any data you want to send along with the notification
        data: {
          restarurantStatus: "true", // Include other booking details as needed
        }
      };

      // Send the notification to all device tokens
      const response = await admin.messaging().sendMulticast({
        tokens: deviceTokens,
        ...notificationPayload,
      });



      // Check the response for successes and failures
      // if (response.failureCount > 0) {
      //     console.error('Failed to send notifications to some devices:', response.responses);
      // }

      return ({
        message: 'Push notifications sent successfully',
        response
      });
    } catch (error) {
      console.error(error);
      throw new error("error");
    }
  };
}
