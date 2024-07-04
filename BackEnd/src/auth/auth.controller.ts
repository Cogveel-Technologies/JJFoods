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


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/admin/signupOtp')
  adminSignupOtp(@Body() body: any) {
    return this.authService.adminSignupOtp(body)
  }

  @Post('/superAdmin')
  superAdminLogin(@Body() body) {
    console.log(body)
    const res = this.authService.superAdminLogin(body);
    return res;
  }



  @Put('/superAdmin/update')
  @UseInterceptors(FileInterceptor('file'))
  superAdminUpdate(@Body() updateProfileDto,
    @UploadedFile() file: Express.Multer.File,) {
    console.log("update called");
    return this.authService.superAdminUpdate(updateProfileDto, file);

  }
  //rbac
  @Put('/updateRestaurantStatus')
  restaurantStatus() {
    // console.log(body)
    return this.authService.restaurantStatus();
  }

  @Get('/getRestaurantStatus')
  getRestaurantStatus() {

    return this.authService.getRestaurantStatus();
  }
  @Post('/superadmin1')
  superAdmin(@Body() body) {
    return this.authService.superadmin(body)
  }

  @Post('/admin/signup')
  adminSignUp(@Body() body: any) {
    return this.authService.adminSignUp(body)
  }

  @Post('/admin/loginOtp')
  adminLoginOtp(@Body() body: any) {
    return this.authService.adminLoginOtp(body)
  }

  @Post('/admin/login')
  adminLogin(@Body() body: any) {
    return this.authService.adminLogin(body)
  }
  @Post('/check')
  check(@Body() body: any) {
    return this.authService.check(body);
  }

  @Post('/signupOtp')
  signupOtp(@Body() signupOtpDto) {
    return this.authService.signupOtp(signupOtpDto);
  }

  @Post('/signup')
  signUp(@Body() signupDto) {
    console.log(signupDto)
    return this.authService.signUp(signupDto);
  }

  @Post('/loginOtp')
  loginOtp(@Body() loginOtpDto: LoginOtpDto) {
    return this.authService.loginOtp(loginOtpDto);
  }

  @Post('/login')
  login(@Body() loginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/updatePhoneNumber')
  updatePhoneNumber(@Body() body: any) {
    return this.authService.updatePhoneNumber(body);
  }

  @Post('/updateEmailId')
  updateEmailId(@Body() updateProfileOtpDto: UpdateProfileOtpDto) {
    return this.authService.updateEmailId(updateProfileOtpDto);
  }

  @Put('/updateProfile')
  @UseInterceptors(FileInterceptor('file'))
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.updateProfile(updateProfileDto, file);
  }



  @Delete('/delete')
  deleteProfile(@Body() body: any) {
    return this.authService.deleteProfile(body);
  }

  // Address management
  @Post('/addAddress')
  addAddress(@Body() addressDto: any) {
    return this.authService.addAddress(addressDto);
  }

  @Get('/getAddresses/:id')
  getAddresses(@Param('id') id: string) {
    return this.authService.getAddresses(id);
  }

  @Get('/getAddress/:id')
  getAddress(@Param('id') id: string) {
    return this.authService.getAddress(id);
  }

  @Put('/updateAddress/:id')
  updateAddress(@Body() updateAddressDto: any, @Param('id') id: string) {
    return this.authService.updateAddress(updateAddressDto, id);
  }

  @Delete('/deleteAddress/:id')
  deleteAddress(@Param('id') id: string, @Body() body: any) {
    return this.authService.deleteAddress(id, body.userId);
  }

  @Get('/searchAddress/:userId')
  searchAddress(@Param('userId') userId, @Query('q') q
  ) {
    return this.authService.searchAddress(userId, q);
  }

  @Put('/updateState/:id')
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
