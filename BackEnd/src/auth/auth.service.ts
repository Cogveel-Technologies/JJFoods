import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs'
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignupDto } from './dtos/signup.dto';
import { LoginOtpDto } from './dtos/loginOtp.dto';
import { SignupOtp } from './schemas/signupOtp.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto } from './dtos/login.dto';
import { UpdateProfileOtpDto } from './dtos/updateProfileOtp.dto';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { Address } from './schemas/address.schema';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NotFoundError } from 'rxjs';
import { CartService } from 'src/cart/cart.service';
import { Admin } from './schemas/admin.schema';
const admin = require("../utils/firebase/firebaseInit")
const axios = require('axios');
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SignupOtp.name) private signupOtpModel: Model<SignupOtp>,
    @InjectModel(Address.name) private addressModel: Model<Address>,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    @InjectModel(Admin.name) private adminModel: Model<Admin>) {

  }
  bucket = admin.storage().bucket();
  sendMail(email: string, otp: number): void {
    const welcomeMessage = `
        <p>Dear Valued Customer,</p>
        <p>Welcome to JJFoods! 🍽️</p>
        <p>We're delighted to have you join us on this culinary adventure. At JJFoods, we're passionate about serving delicious meals that tantalize your taste buds and create unforgettable dining experiences.</p>
        <p>From our mouthwatering dishes crafted with the finest ingredients to our cozy ambiance and friendly staff, we're committed to providing you with exceptional service and delectable flavors that keep you coming back for more.</p>
        <p>Whether you're craving a hearty breakfast to start your day, a satisfying lunch to refuel, or a gourmet dinner to indulge your senses, we've got you covered. Our diverse menu offers a wide range of options to satisfy every palate and dietary preference.</p>
        <p>As a new member of the JJFoods family, we invite you to explore our menu, discover your favorites, and embark on a culinary journey like no other. Our team is here to ensure that every meal is a memorable one, and we look forward to serving you soon!</p>
        <p>Thank you for choosing JJFoods. We're honored to be a part of your dining experience.</p>
        <p>Your One-Time Password (OTP) for account verification: <strong>${otp}</strong></p>
        <p>Bon appétit!</p>
        <p>Warm regards,</p>
        <p>The JJFoods Team</p>
    `;

    try {
      this.mailerService.sendMail({
        to: email,
        from: this.configService.get<string>('EMAIL'),
        subject: 'Welcome to JJFoods!',
        html: welcomeMessage
      });
      console.log(`Email sent successfully to ${email}`);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
      // Handle the error (e.g., log it, send a notification, etc.)
    }
  }

  async check(body: any) {
    try {
      let existing;

      if (body && body?.emailId) {
        existing = await this.userModel.findOne({ emailId: body.emailId });
      } else if (body && body?.phoneNumber) {
        existing = await this.userModel.findOne({ phoneNumber: body.phoneNumber });
      }

      if (!existing) {
        return { message: "0" };
      }

      if (existing.isActive) {
        return { message: 'User already exists. Please login to continue.' };
      }

      return { message: 'You already had an account with us. Login to activate.' };
    } catch (error) {
      throw new Error(`Failed to check user: ${error.message}`);
    }
  }

  async smsGatewayOtp(body) {
    try {
      // Replace the placeholders with actual values
      const apiKey = this.configService.get<string>('SMS_KEY');
      const phoneNumber = body.phoneNumber;
      const otp = body.otp;
      const templateName = 'OTP';

      // Construct the URL
      const url = `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumber}/${otp}/${templateName}`;

      // Make the GET request using fetch
      const response = await fetch(url, {
        method: 'GET'
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      // Parse the response JSON
      const data = await response.json();
      console.log('Success:', data);

      // Return the response data
      return data;
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      // Handle the error (e.g., log it, send a notification, etc.)
      throw error; // Re-throw the error to be caught by the caller
    }
  }


  async smsGatewayVerify(body) {
    try {
      const apiKey = this.configService.get<string>('SMS_KEY');
      const phoneNumber = body.phoneNumber;
      const otp = body.otp;

      const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/${phoneNumber}/${otp}`;

      // Make the GET request using fetch
      const response = await fetch(url, {
        method: 'GET'
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      // Parse the response JSON
      const data = await response.json();
      console.log(data);

      return data;
    } catch (error) {
      console.error('Error:', error.message);
      // Handle the error (e.g., log it, send a notification, etc.)
      throw error; // Re-throw the error to be caught by the caller
    }
  }



  generateOtp(): number {
    // Generate a random validation code
    const min = 10000;
    const max = 99999;
    const validationCode = Math.floor(min + Math.random() * (max - min + 1));

    // Return the validation code
    return validationCode;
  }
  async superAdminLogin(body) {
    const admin = await this.adminModel.findOne({ emailId: body.emailId });
    const isPasswordMatch = await bcrypt.compare(body.password, admin.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('invalid credentials')
    }

    return {
      "_id": admin._id,
      "emailId": admin.emailId,
      "name": admin.name,
      "phoneNumber": admin.phoneNumber
    };


  }
  async superAdminUpdate(updateProfileDto: any, file: Express.Multer.File) {
    try {

      // if (updateProfileDto?.isAdmin !== undefined) {
      //   delete updateProfileDto.isAdmin;
      // }
      // Find user by phone number
      const admin = await this.adminModel.findOne({ emailId: updateProfileDto.emailId });
      if (!admin) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Update user profile information
      const updatedUser = await this.adminModel.findOneAndUpdate(
        { emailId: updateProfileDto.emailId },
        { $set: updateProfileDto },
        { new: true } // Return the updated document
      );

      // If a file is provided, upload the image and set the imageUrl
      if (file) {
        const imageUrl = await this.uploadImage(file);
        updatedUser.imageUrl = imageUrl;
      }

      // Save the updated user document
      await updatedUser.save();

      return {
        "_id": updatedUser._id,
        "emailId": updatedUser.emailId,
        "name": updatedUser.name,
        "phoneNumber": updatedUser.phoneNumber,
        "imageUrl": updatedUser.imageUrl
      };
    } catch (error) {
      // Handle errors
      throw new HttpException(`Failed to update profile: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async restaurantStatus(body) {
    const admin = await this.adminModel.findOne({ _id: body.admin })
    if (!admin) {
      throw new Error("cant access")
    }
    admin?.isOpen ? admin.isOpen = false : admin.isOpen = true;
    await admin.save();
    return {
      "state": admin.isOpen
    }


  }
  async getRestaurantStatus(id) {
    const admin = await this.adminModel.findOne({ _id: id })
    if (!admin) {
      throw new Error("admin not found");
    }
    return {
      "state": admin?.isOpen
    }

  }
  async superadmin(body) {

    // console.log(body.password)

    const hashedPassword = await bcrypt.hash(body.password, 10);
    delete body.password;

    body["password"] = hashedPassword
    // console.log(body)
    await this.adminModel.create(body);
    return "done"


  }
  async adminSignupOtp(signupOtpDto) {
    try {
      const existingUserByEmail = await this.userModel.findOne({
        emailId: signupOtpDto.emailId,
      });
      if (existingUserByEmail && existingUserByEmail.isActive) {
        return new HttpException(
          'User with this email already exists.',
          HttpStatus.CONFLICT,
        );
      }

      const existingUserByPhoneNumber = await this.userModel.findOne({
        phoneNumber: signupOtpDto.phoneNumber,
      });
      if (existingUserByPhoneNumber && existingUserByPhoneNumber.isActive) {
        return new HttpException(
          'User with this phone number already exists.',
          HttpStatus.CONFLICT,
        );
      }

      const existingOtp = await this.signupOtpModel.findOne({
        emailId: signupOtpDto.emailId,
      });
      let otp = this.generateOtp();
      if (existingOtp) {
        await this.signupOtpModel.findOneAndUpdate(
          { emailId: signupOtpDto.emailId },
          { otp },
        );
      } else {
        const newUser = new this.signupOtpModel({
          emailId: signupOtpDto.emailId,
          otp,
        });
        await newUser.save();
      }

      const body = {
        phoneNumber: signupOtpDto.phoneNumber,
        otp,
      };
      this.smsGatewayOtp(body);

      // Send email
      this.sendMail(signupOtpDto.emailId, otp);

      return { message: 'OTP sent' };
    } catch (error) {
      // Throw a custom HTTP exception with the error message
      return new HttpException(
        `Failed to sign up: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async adminSignUp(signupDto) {
    try {
      // Check if user with the same email and phoneNumber already exists
      const existingUser = await this.userModel.findOne({
        emailId: signupDto.emailId,
        phoneNumber: signupDto.phoneNumber
      });
      if (existingUser) {
        throw new HttpException(
          'User with this email already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if user exists in OTP collection
      const user = await this.signupOtpModel.findOne({ emailId: signupDto.emailId });
      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      // Validate OTP
      if (user.otp !== signupDto.otp) {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      // Verify OTP with SMS gateway
      const resp = await this.smsGatewayVerify({
        phoneNumber: signupDto.phoneNumber,
        otp: signupDto.otp,
      });

      // Check the response status
      if (resp['Status'] === 'Error') {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      // Create a new user instance
      const createdUser = new this.userModel({
        name: signupDto.name,
        emailId: signupDto.emailId,
        phoneNumber: signupDto.phoneNumber,
        isAdmin: true
      });

      // Save the user to the database
      await createdUser.save();
      return createdUser;
    } catch (error) {
      // Handle errors
      throw new HttpException(
        `Failed to sign up: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async adminLoginOtp(loginOtpDto) {
    try {
      // Find user by phone number
      const user = await this.userModel.findOne({ phoneNumber: loginOtpDto.phoneNumber });
      if (!user) {
        return new HttpException('User not found. Please SignUp to continue.', HttpStatus.NOT_FOUND);
      }
      //is admin  
      if (!user.isAdmin) {
        return new HttpException('Admin not found. Please SignUp to continue.', HttpStatus.NOT_FOUND);
      }


      // Reactivate the user account if inactive
      if (!user.isActive) {
        user.isActive = true;
        await user.save();
      }

      // Generate and update OTP for the user
      const otp = this.generateOtp();
      await this.signupOtpModel.findOneAndUpdate({ emailId: user.emailId }, { otp });

      // Send OTP via SMS
      const body = {
        phoneNumber: loginOtpDto.phoneNumber,
        otp
      };
      this.smsGatewayOtp(body);

      // Send OTP via email
      this.sendMail(user.emailId, otp);

      return { data: 'OTP sent' };
    } catch (error) {
      // Handle errors
      throw new HttpException(`Login failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async adminLogin(loginDto) {
    try {
      // Find user by phone number
      const user = await this.userModel.findOne({ phoneNumber: loginDto.phoneNumber });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      //is admin  
      if (!user.isAdmin) {
        return new HttpException('Admin not found. Please SignUp to continue.', HttpStatus.NOT_FOUND);
      }

      // Verify OTP
      const resp = await this.smsGatewayVerify({
        phoneNumber: loginDto.phoneNumber,
        otp: loginDto.otp
      });
      if (resp.Status === 'Error') {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      // Retrieve OTP for user from the database
      const userOtp = await this.signupOtpModel.findOne({ emailId: user.emailId });
      if ((!userOtp) || (userOtp.otp !== loginDto.otp)) {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      return user;
    } catch (error) {
      // Handle errors
      throw new HttpException(`Login failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signupOtp(signupOtpDto) {

    try {
      const existingUserByEmail = await this.userModel.findOne({
        emailId: signupOtpDto.emailId,
      });
      if (existingUserByEmail && existingUserByEmail.isActive) {
        return new HttpException(
          'User with this email already exists.',
          HttpStatus.CONFLICT,
        );
      }

      const existingUserByPhoneNumber = await this.userModel.findOne({
        phoneNumber: signupOtpDto.phoneNumber,
      });
      if (existingUserByPhoneNumber && existingUserByPhoneNumber.isActive) {
        return new HttpException(
          'User with this phone number already exists.',
          HttpStatus.CONFLICT,
        );
      }

      const existingOtp = await this.signupOtpModel.findOne({
        emailId: signupOtpDto.emailId,
      });
      let otp = this.generateOtp();
      if (existingOtp) {
        await this.signupOtpModel.findOneAndUpdate(
          { emailId: signupOtpDto.emailId },
          { otp },
        );
      } else {
        const newUser = new this.signupOtpModel({
          emailId: signupOtpDto.emailId,
          otp,
        });
        await newUser.save();
      }

      const body = {
        phoneNumber: signupOtpDto.phoneNumber,
        otp,
      };
      this.smsGatewayOtp(body);

      // Send email
      this.sendMail(signupOtpDto.emailId, otp);

      return { message: 'OTP sent' };
    } catch (error) {
      // Throw a custom HTTP exception with the error message
      return new HttpException(
        `Failed to sign up: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signUp(signupDto) {
    try {
      // Check if user with the same email and phoneNumber already exists
      const existingUser = await this.userModel.findOne({
        emailId: signupDto.emailId,
        phoneNumber: signupDto.phoneNumber
      });
      if (existingUser) {
        throw new HttpException(
          'User with this email already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if user exists in OTP collection
      const user = await this.signupOtpModel.findOne({ emailId: signupDto.emailId });
      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      // Validate OTP
      if (user.otp !== signupDto.otp) {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      // Verify OTP with SMS gateway
      const resp = await this.smsGatewayVerify({
        phoneNumber: signupDto.phoneNumber,
        otp: signupDto.otp,
      });

      // Check the response status
      if (resp['Status'] === 'Error') {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      // Create a new user instance
      const createdUser = new this.userModel({
        name: signupDto.name,
        emailId: signupDto.emailId,
        phoneNumber: signupDto.phoneNumber,
        deviceToken: signupDto?.deviceToken
      });

      // Save the user to the database
      await createdUser.save();
      await this.cartService.bulkAddCart({ userId: createdUser._id, products: signupDto?.products })
      return createdUser;
    } catch (error) {
      // Handle errors
      throw new HttpException(
        `Failed to sign up: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginOtp(loginOtpDto) {
    try {
      // Find user by phone number
      const user = await this.userModel.findOne({ phoneNumber: loginOtpDto.phoneNumber });
      if (!user) {
        return new HttpException('User not found. Please ignUp to continue.', HttpStatus.NOT_FOUND);
      }

      // Reactivate the user account if inactive
      if (!user.isActive) {
        user.isActive = true;
        await user.save();
      }

      // Generate and update OTP for the user
      const otp = this.generateOtp();
      await this.signupOtpModel.findOneAndUpdate({ emailId: user.emailId }, { otp });

      // Send OTP via SMS
      const body = {
        phoneNumber: loginOtpDto.phoneNumber,
        otp
      };
      this.smsGatewayOtp(body);

      // Send OTP via email
      this.sendMail(user.emailId, otp);

      return { data: 'OTP sent' };
    } catch (error) {
      // Handle errors
      throw new HttpException(`Login failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }




  async login(loginDto) {
    try {
      // Find user by phone number
      const user = await this.userModel.findOne({ phoneNumber: loginDto.phoneNumber });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }



      // Verify OTP
      const resp = await this.smsGatewayVerify({
        phoneNumber: loginDto.phoneNumber,
        otp: loginDto.otp
      });
      if (resp.Status === 'Error') {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      // Retrieve OTP for user from the database
      const userOtp = await this.signupOtpModel.findOne({ emailId: user.emailId });
      if ((!userOtp) || (userOtp.otp !== loginDto.otp)) {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }
      user.deviceToken = loginDto?.deviceToken;
      await user.save()

      return user;
    } catch (error) {
      // Handle errors
      throw new HttpException(`Login failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async updatePhoneNumber(body) {
    try {
      if (!body.phoneNumber) {
        throw new Error('phone number is required')
      }
      // Check if user with the same phoneNumber already exists
      const existingUser = await this.userModel.findOne({ phoneNumber: body.phoneNumber });
      if (existingUser) {
        throw new Error("User with this phone number already exists.");
      }

      let otp = this.generateOtp();
      await this.signupOtpModel.findOneAndUpdate({ emailId: body.emailId }, { otp })
      this.sendMail(body.emailId, otp)

      return { "data": "otp sent" }

    } catch (error) {
      // Handle errors
      throw new Error(`Login failed: ${error.message}`);

    }
  }

  async updateEmailId(updateProfileOtpDto: UpdateProfileOtpDto) {
    try {

      if (!updateProfileOtpDto.emailId) {
        throw new Error('emailId is required')
      }
      // Check if user with the same email already exists
      const existingUser = await this.userModel.findOne({ emailId: updateProfileOtpDto.emailId });
      if (existingUser) {
        throw new Error("User with this email already exists.");
      }

      let otp = this.generateOtp();
      await this.signupOtpModel.findOneAndUpdate({ phoneNumber: updateProfileOtpDto.phoneNumber }, { otp })
      this.sendMail(updateProfileOtpDto.emailId, otp)

      return "otp sent"

    } catch (error) {
      // Handle errors
      throw new Error(`Login failed: ${error.message}`);

    }

  }
  async uploadImage(image) {
    try {
      // if (!image || !image.originalname) {
      //   throw new Error('Image file not provided');
      // }
      // console.log(image)
      const fileName = image.originalname;
      const fileUpload = this.bucket.file(fileName);
      const fileStream = image.buffer; // Use buffer for file data

      // Upload image to Firebase Storage
      await fileUpload.save(fileStream, {
        metadata: {
          contentType: image.mimetype
        }
      });

      // Make the image publicly accessible
      await fileUpload.makePublic();

      // Get public URL for the image
      const [url] = await fileUpload.getSignedUrl({ action: 'read', expires: '03-09-3024' }); // Adjust the expiration date as needed

      return url;
    } catch (error) {
      console.error('Error uploading image to Firebase Storage:', error);
      throw error;
    }
  }

  async updateProfile(updateProfileDto: any, file: Express.Multer.File) {
    try {

      if (updateProfileDto?.isAdmin !== undefined) {
        delete updateProfileDto.isAdmin;
      }
      // Find user by phone number
      const user = await this.userModel.findOne({ phoneNumber: updateProfileDto.phoneNumber });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Update user profile information
      const updatedUser = await this.userModel.findOneAndUpdate(
        { phoneNumber: updateProfileDto.phoneNumber },
        { $set: updateProfileDto },
        { new: true } // Return the updated document
      );

      // If a file is provided, upload the image and set the imageUrl
      if (file) {
        const imageUrl = await this.uploadImage(file);
        updatedUser.imageUrl = imageUrl;
      }

      // Save the updated user document
      await updatedUser.save();

      return updatedUser;
    } catch (error) {
      // Handle errors
      throw new HttpException(`Failed to update profile: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProfile(body: any) {
    try {
      const user = await this.userModel.findById(body.userId);

      // Check if the user exists
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update the user's isActive status and reason
      user.isActive = false;
      user.reason = body.reason;

      // Save the updated user
      await user.save();

      return user;
    } catch (error) {
      // Handle errors
      throw new HttpException(`Failed to delete profile: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // address

  async addAddress(addressDto: any) {
    try {
      // Log the address DTO for debugging
      console.log(addressDto);

      // If the address is marked as default, update all other addresses to non-default
      if (addressDto.isDefault) {
        await this.addressModel.updateMany({ isDefault: true }, { $set: { isDefault: false } });
      }

      // Create and save the new address
      const createdAddress = new this.addressModel(addressDto);
      await createdAddress.save();

      return createdAddress;
    } catch (error) {
      // Handle errors
      throw new HttpException(`Failed to add address: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAddresses(id: any) {
    try {
      const addresses = await this.addressModel.find({ user: id });
      return addresses;
    } catch (error) {
      // Handle errors
      throw new HttpException(`Failed to retrieve addresses: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getAddress(id: any) {
    try {
      const address = await this.addressModel.findOne({ _id: id });
      if (!address) {
        throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
      }
      return address;
    } catch (error) {
      // Handle errors
      throw new HttpException(`Failed to retrieve address: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async updateAddress(updateAddressDto, id) {
    try {
      if (updateAddressDto.isDefault) {
        await this.addressModel.updateMany({ isDefault: true }, { $set: { isDefault: false } });
      }

      const updatedAddress = await this.addressModel.findOneAndUpdate(
        { _id: id },
        updateAddressDto,
        { new: true }
      );

      if (!updatedAddress) {
        throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
      }

      return await this.getAddresses(updatedAddress.user);
    } catch (error) {
      // Handle errors
      throw new HttpException(`Failed to update address: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async deleteAddress(id: string, userId: string) {
    try {
      const deleteResult = await this.addressModel.deleteOne({ _id: id });

      if (deleteResult.deletedCount === 0) {
        throw new NotFoundException('Address not found');
      }

      const userAddresses = await this.addressModel.find({ user: userId });

      if (userAddresses.length === 1) {
        await this.addressModel.updateOne({ _id: userAddresses[0]._id }, { $set: { isDefault: true } });
      }

      return await this.getAddresses(userId);
    } catch (error) {
      throw new HttpException(`Failed to delete address: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchAddress(userId, query) {
    try {
      // Trim and sanitize the query string
      const sanitizedQ = query.trim();
      const sanitizedQuery = sanitizedQ.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

      // Define the search keyword conditionally based on the sanitized query
      const keyword = sanitizedQuery ? {
        $or: [
          { name: { $regex: sanitizedQuery, $options: 'i' } },
          { address1: { $regex: sanitizedQuery, $options: 'i' } },
          { address2: { $regex: sanitizedQuery, $options: 'i' } },
          { address3: { $regex: sanitizedQuery, $options: 'i' } },
          { addressType: { $regex: sanitizedQuery, $options: 'i' } }
        ]
      } : {};

      // Combine the userId condition with the keyword search
      const searchCriteria = {
        user: userId,
        ...keyword
      };

      // Execute the query
      const result = await this.addressModel.find(searchCriteria).exec();
      return result;
    } catch (error) {
      // Handle errors appropriately
      // console.error('Error executing search query:', error);
      return [];
    }
  }

  async updateState(id: string, userId: string) {
    try {
      // Set all addresses for the user to non-default
      await this.addressModel.updateMany({ user: userId, isDefault: true }, { $set: { isDefault: false } });

      // Set the specified address to default
      const updatedAddress = await this.addressModel.updateOne({ _id: id, user: userId }, { $set: { isDefault: true } });

      if (!updatedAddress) {
        throw new HttpException('Address not found or already set as default', HttpStatus.NOT_FOUND);
      }

      return await this.getAddresses(userId);
    } catch (error) {
      throw new HttpException(`Failed to update address state: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async automaticAddress(ip) {



    const options = {
      method: 'GET',
      url: 'http://ipwho.is/' + ip

    }


    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data
    } catch (error) {
      throw new Error("enter valid ip")
      console.error(error);
    }
  }

}
