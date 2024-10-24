import { RolesBuilder } from "nest-access-control";
import { User } from './schemas/user.schema';


export enum UserRoles {
  Admin = 'Admin',
  User = 'User'

}

export const roles: RolesBuilder = new RolesBuilder();

roles.grant(UserRoles.User)
  .readAny(['discount'])
  .grant(UserRoles.Admin)
  .extend(UserRoles.User)
  .createAny(['discount']);