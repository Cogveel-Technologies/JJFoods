import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserJwtGuard } from './user-jwt.guard';
import { AdminJwtGuard } from './admin-jwt.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly userJwtGuard: UserJwtGuard,
    private readonly adminJwtGuard: AdminJwtGuard,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const userActivate = await this.userJwtGuard.canActivate(context);
      if (userActivate) {
        return true;
      }
    } catch (error) {
      // Ignore user guard error and try admin guard
    }

    try {
      const adminActivate = await this.adminJwtGuard.canActivate(context);
      if (adminActivate) {
        return true;
      }
    } catch (error) {
      // Ignore admin guard error
    }

    throw new UnauthorizedException('Not authorized 123');
  }
}
