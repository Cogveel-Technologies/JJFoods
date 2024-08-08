import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuCT, MenuCTSchema } from './schema/menu.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryCT, CategoryCTSchema } from './schema/categoryct.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MenuCT.name, schema: MenuCTSchema }, { name: CategoryCT.name, schema: CategoryCTSchema }]), AuthModule],
  providers: [MenuService],
  controllers: [MenuController]
})
export class MenuModule { }
