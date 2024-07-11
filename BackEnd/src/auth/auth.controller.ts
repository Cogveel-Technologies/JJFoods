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
    return res;
  }



  @Put('/superAdmin/update')
  @UseGuards(AuthGuard('admin-jwt'))
  @UseInterceptors(FileInterceptor('file'))
  superAdminUpdate(@Body() updateProfileDto,
    @UploadedFile() file: Express.Multer.File,) {
    // console.log("update called");
    return this.authService.superAdminUpdate(updateProfileDto, file);

  }
  //rbac
  @Put('/updateRestaurantStatus')
  @UseGuards(AuthGuard('admin-jwt'))
  restaurantStatus() {
    // console.log(body)
    return this.authService.restaurantStatus();
  }

  @Get('/getRestaurantStatus')
  getRestaurantStatus() {

    return this.authService.getRestaurantStatus();
  }
  //create a new admin
  @Post('/superadmin1')
  superAdminSignup(@Body() body) {
    return this.authService.superadminSignup(body)
  }


  @Post('reservedadmin1')
  reservedSignup(@Body() body) {
    return this.authService.reservedSignup(body)
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
  check(@Body() body: any) {
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
  signUp(@Body() signupDto) {
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
  deleteProfile(@Body() body: any) {
    return this.authService.deleteProfile(body);
  }

  // Address management
  @Post('/addAddress')
  @UseGuards(AuthGuard('user-jwt'))
  addAddress(@Body() addressDto: any) {
    return this.authService.addAddress(addressDto);
  }

  @Get('/getAddresses/:id')
  @UseGuards(AuthGuard('user-jwt'))
  getAddresses(@Param('id') id: string) {
    return this.authService.getAddresses(id);
  }

  @Get('/getAddress/:id')
  @UseGuards(AuthGuard('user-jwt'))
  getAddress(@Param('id') id: string) {
    return this.authService.getAddress(id);
  }

  @Put('/updateAddress/:id')
  @UseGuards(AuthGuard('user-jwt'))
  updateAddress(@Body() updateAddressDto: any, @Param('id') id: string) {
    return this.authService.updateAddress(updateAddressDto, id);
  }

  @Delete('/deleteAddress/:id')
  @UseGuards(AuthGuard('user-jwt'))
  deleteAddress(@Param('id') id: string, @Body() body: any) {
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
  async updateState(@Param('id') id: string, @Body() body: any) {
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
