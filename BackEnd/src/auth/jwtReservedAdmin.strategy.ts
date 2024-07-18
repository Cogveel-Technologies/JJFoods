import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'

import { Model } from "mongoose";
import { Admin } from "./schemas/admin.schema";



@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'reserved-admin-jwt') {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    })

  }

  async validate(payload: any) {
    const { id } = payload;
    const admin = await this.adminModel.findById(id);
    if (admin.role != 'reservedAdmin') {
      throw new UnauthorizedException('Not authorized')
    }

    if (!admin) {
      throw new UnauthorizedException('Not authorized')
    }
    return admin;
  }


}