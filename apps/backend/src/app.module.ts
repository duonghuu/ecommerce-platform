import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './modules/home/home.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BannersModule } from './modules/banners/banners.module';

@Module({
  imports: [PrismaModule, HomeModule, ProductsModule, CategoriesModule, BannersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
