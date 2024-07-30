import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schema/menu.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]), AuthModule],
  providers: [MenuService],
  controllers: [MenuController]
})
export class MenuModule { }
