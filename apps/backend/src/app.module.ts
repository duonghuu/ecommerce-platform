import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './modules/home/home.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BannersModule } from './modules/banners/banners.module';
import { AuthModule } from './modules/auth/auth.module';
import { MediasModule } from './modules/medias/medias.module';
import { CartModule } from './modules/cart/cart.module';
@Module({
  imports: [PrismaModule, HomeModule, ProductsModule, CategoriesModule, BannersModule, AuthModule, MediasModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
