import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginOtpDto } from './dtos/loginOtp.dto';
import { SignupOtpDto } from './dtos/signupOtp.dto';
import { LoginDto } from './dtos/login.dto';
import { UpdateProfileOtpDto } from './dtos/updateProfileOtp.dto';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminLoginDto } from './dtos/adminLogin.dto';
import { CheckDto } from './dtos/check.dto';
import { UserDeleteDto } from './dtos/userDelete.dto';
import { AddressDto } from './dtos/address.dto';
import { UpdateAddressDto } from './dtos/updateAddress.dto';
import { DeleteAddressDto } from './dtos/deleteAddress.dto';
import { UpdateAdminDto } from './dtos/updateAdmin.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @Post('/admin/signupOtp')
  // adminSignupOtp(@Body() body: any) {
  //   return this.authService.adminSignupOtp(body)
  // }

  @Post('/superAdmin')
  superAdminLogin(@Body() body: AdminLoginDto) {
    // console.log(body)
    const res = this.authService.superAdminLogin(body);
    // console.log(res)
    return res;
  }

  @Post('/reservedadminlogin')
  reservedAdminLogin(@Body() body: AdminLoginDto) {
    const res = this.authService.reservedAdminLogin(body);
    return res;
  }



  @Put('/superAdmin/update')
  @UseGuards(AuthGuard('admin-jwt'))
  @UseInterceptors(FileInterceptor('file'))
  superAdminUpdate(@Body() updateProfileDto: UpdateAdminDto,
    @UploadedFile() file: Express.Multer.File,) {
    // console.log(updateProfileDto, file);
    return this.authService.superAdminUpdate(updateProfileDto, file);

  }
  //rbac
  @Put('/updateRestaurantStatus')
  @UseGuards(AuthGuard('admin-jwt'))
  restaurantStatus() {
    // console.log(body)
    return this.authService.restaurantStatus();
  }
  @Put('/updateRestaurantMenu')
  @UseGuards(AuthGuard('admin-jwt'))
  restaurantMenuStatus() {
    // console.log(body)
    return this.authService.restaurantMenuStatus();
  }

  @Put('/updateRestaurantTax')
  @UseGuards(AuthGuard('admin-jwt'))
  restaurantTax(@Body() body) {
    // console.log(body)
    return this.authService.restaurantTax(body);
  }

  @Get('/getRestaurantTax')
  @UseGuards(AuthGuard('admin-jwt'))
  getRestaurantTax() {
    // console.log(body)
    return this.authService.getRestaurantTax();
  }
  @Get('/getRestaurantStatus')
  async getRestaurantStatus() {
    //to change restaurant and menu status in this api
    // console.log("called1")

    const res = this.authService.getRestaurantStatus();
    // console.log(await res)
    // return { state: false }
    return res
  }


  @Get('/getRestaurantMenuStatus')
  getRestaurantMenuStatus() {

    return this.authService.getRestaurantMenuStatus();
  }
  //create a new admin
  @Post('/superadmin1')
  superAdminSignup(@Body() body) {
    return this.authService.superadminSignup(body)
  }


  @Post('reservedadminA')
  reservedSignupA(@Body() body) {
    return this.authService.reservedASignup(body)
  }
  @Post('reservedadminB')
  reservedSignupB(@Body() body) {
    return this.authService.reservedBSignup(body)
  }

  // @Post('/admin/signup')
  // adminSignUp(@Body() body: any) {
  //   return this.authService.adminSignUp(body)
  // }

  // @Post('/admin/loginOtp')
  // adminLoginOtp(@Body() body: any) {
  //   return this.authService.adminLoginOtp(body)
  // }

  // @Post('/admin/login')
  // adminLogin(@Body() body: any) {
  //   return this.authService.adminLogin(body)
  // }
  @Post('/check')
  check(@Body() body: CheckDto) {
    return this.authService.check(body);
  }

  @Post('/signupOtp')
  signupOtp(@Body() signupOtpDto: SignupOtpDto) {
    // console.log(signupOtpDto)
    const res = this.authService.signupOtp(signupOtpDto);
    // console.log(res)
    return res;
  }

  @Post('/signup')
  signUp(@Body() signupDto: SignupDto) {
    // console.log(signupDto)
    const res = this.authService.signUp(signupDto);
    // console.log(res)
    return res;
  }

  @Post('/loginOtp')
  loginOtp(@Body() loginOtpDto: LoginOtpDto) {
    return this.authService.loginOtp(loginOtpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/updatePhoneNumber')
  @UseGuards(AuthGuard('user-jwt'))
  updatePhoneNumber(@Body() body: any) {
    return this.authService.updatePhoneNumber(body);
  }

  @Post('/updateEmailId')
  @UseGuards(AuthGuard('user-jwt'))
  updateEmailId(@Body() updateProfileOtpDto: UpdateProfileOtpDto) {
    return this.authService.updateEmailId(updateProfileOtpDto);
  }

  @Put('/updateProfile')
  @UseGuards(AuthGuard('user-jwt'))
  @UseInterceptors(FileInterceptor('file'))
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.updateProfile(updateProfileDto, file);
  }



  @Delete('/delete')
  @UseGuards(AuthGuard('user-jwt'))
  deleteProfile(@Body() body: UserDeleteDto) {
    // console.log(body)
    return this.authService.deleteProfile(body);
  }

  // Address management
  @Post('/addAddress')
  @UseGuards(AuthGuard('user-jwt'))
  addAddress(@Body() addressDto: AddressDto) {
    // console.log(addressDto)
    return this.authService.addAddress(addressDto);
  }

  @Get('/getAddresses/:id')
  @UseGuards(AuthGuard('user-jwt'))
  getAddresses(@Param('id') id: string) {
    // console.log("called")
    return this.authService.getAddresses(id);
  }

  @Get('/getAddress/:id')
  @UseGuards(AuthGuard('user-jwt'))
  getAddress(@Param('id') id: string) {
    return this.authService.getAddress(id);
  }

  @Put('/updateAddress/:id')
  @UseGuards(AuthGuard('user-jwt'))
  updateAddress(@Body() updateAddressDto: UpdateAddressDto, @Param('id') id: string) {
    // console.log(updateAddressDto)
    return this.authService.updateAddress(updateAddressDto, id);
  }

  @Delete('/deleteAddress/:id')
  @UseGuards(AuthGuard('user-jwt'))
  deleteAddress(@Param('id') id: string, @Body() body: DeleteAddressDto) {
    return this.authService.deleteAddress(id, body.userId);
  }

  @Get('/searchAddress/:userId')
  @UseGuards(AuthGuard('user-jwt'))
  searchAddress(@Param('userId') userId, @Query('q') q
  ) {
    return this.authService.searchAddress(userId, q);
  }

  //default address update
  @Put('/updateState/:id')
  @UseGuards(AuthGuard('user-jwt'))
  async updateState(@Param('id') id: string, @Body() body: DeleteAddressDto) {
    return await this.authService.updateState(id, body.userId);
  }

  @Get('/automaticAddress/:ip')
  automaticAddress(@Param('ip') ip: string) {
    return this.authService.automaticAddress(ip);
  }

  @Get('/nisaruncle')
  @UseGuards(AuthGuard('user-jwt'))
  nisaruncle(@Req() req) {
    return req.user;

  }

  @Get('/husban')
  @UseGuards(AuthGuard('admin-jwt'))
  husban(@Req() req) {
    console.log(req.user)
    return req.user;

  }
  @Get('/husbanuncle')
  @UseGuards(JwtAuthGuard)
  husbanuncle(@Req() req) {
    console.log(req.user)
    return req.user;

  }


}
