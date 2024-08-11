import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/auth/schemas/admin.schema';
import { User } from 'src/auth/schemas/user.schema';
const admin = require("../utils/firebase/firebaseInit")
@Injectable()
export class NotificationService {
  constructor(@InjectModel(User.name)
  private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>) {

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
        return new Error("no users")
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

  async orderAccepted(userId) {

    try {
      // Fetch all registered drivers
      const user = await this.userModel.findOne({ _id: userId });

      // Collect all driver device tokens
      const superAdmin = await this.adminModel.findOne({ role: "superAdmin" });
      const deviceTokens = Array.isArray(user.deviceToken) ? user.deviceToken : [user.deviceToken];

      deviceTokens.push(superAdmin?.deviceToken);


      // Define the notification payload
      const notificationPayload = {
        notification: {
          title: "Your order has been accepted",
          body: "Order accepted",
          // You can add more fields here for customization, such as icons, sounds, etc.
        },
        // Define any data you want to send along with the notification
        data: {
          order: "accepted", // Include other booking details as needed
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

  async newOrder() {

    try {
      // Fetch all registered drivers
      // const user = await this.userModel.findOne({ _id: userId });

      // Collect all driver device tokens
      const superAdmin = await this.adminModel.findOne({ role: "superAdmin" });
      const deviceTokens = []

      deviceTokens.push(superAdmin?.deviceToken);


      // Define the notification payload
      const notificationPayload = {
        notification: {
          title: "New Order",
          body: "New Order",
          // You can add more fields here for customization, such as icons, sounds, etc.
        },
        // Define any data you want to send along with the notification
        data: {
          order: "order placed", // Include other booking details as needed
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

  async orderRejected(userId) {

    try {
      // Fetch all registered drivers
      const user = await this.userModel.findOne({ _id: userId });

      // Collect all driver device tokens
      // const superAdmin = await this.adminModel.findOne({ role: "superAdmin" });
      const deviceTokens = Array.isArray(user.deviceToken) ? user.deviceToken : [user.deviceToken];

      // deviceTokens.push(superAdmin?.deviceToken);


      // Define the notification payload
      const notificationPayload = {
        notification: {
          title: "Your order has been rejected",
          body: "Order rejected",
          // You can add more fields here for customization, such as icons, sounds, etc.
        },
        // Define any data you want to send along with the notification
        data: {
          order: "rejected", // Include other booking details as needed
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
