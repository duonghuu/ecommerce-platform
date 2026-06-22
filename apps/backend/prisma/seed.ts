import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config();

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu dọn dẹp dữ liệu cũ...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();

  console.log('Đang tạo dữ liệu mẫu...');

  // 1. Tạo Banners
  await prisma.banner.create({
    data: {
      title: 'Nạp Năng Lượng - Code Phê Hơn',
      subtitle: 'Combo Thức Khuya giảm giá 20% từ 22h - 2h sáng.',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000',
      targetUrl: '/promotions/thuc-khuya',
      position: 'home_hero',
      isActive: true,
    },
  });

  await prisma.banner.create({
    data: {
      title: 'Khuyến Mãi Đồ Ăn Vặt Mùa Hè',
      subtitle: 'Giảm đến 50% cho các sản phẩm bán chạy nhất',
      imageUrl: 'https://images.unsplash.com/photo-1599598425947-3300262c5713?q=80&w=1000',
      targetUrl: '/promotions/mua-he',
      position: 'product_list_top',
      isActive: true,
    },
  });

  // 2. Tạo Categories
  const catSnacks = await prisma.category.create({
    data: {
      name: 'Đồ Ăn Vặt',
      slug: 'do-an-vat',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
      isFeatured: true,
      displayOrder: 1,
    },
  });

  const catDrinks = await prisma.category.create({
    data: {
      name: 'Nước Uống',
      slug: 'nuoc-uong',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3126/3126115.png',
      isFeatured: true,
      displayOrder: 2,
    },
  });

  // 3. Tạo Products
  await prisma.product.createMany({
    data: [
      {
        categoryId: catSnacks.id,
        name: 'Khô Gà Lá Chanh Xé Cay',
        slug: 'kho-ga-la-chanh-xe-cay',
        price: 45000,
        salePrice: 35000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=500',
        stock: 50,
        salesCount: 120,
        isFeatured: true,
      },
      {
        categoryId: catSnacks.id,
        name: 'Bánh Tráng Trộn Cô Tư',
        slug: 'banh-trang-tron-co-tu',
        price: 25000,
        salePrice: null,
        thumbnailUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=500',
        stock: 100,
        salesCount: 300,
        isFeatured: true,
      },
      {
        categoryId: catDrinks.id,
        name: 'Trà Đào Cam Sả',
        slug: 'tra-dao-cam-sa',
        price: 30000,
        salePrice: 25000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=500',
        stock: 40,
        salesCount: 80,
        isFeatured: true,
      },
      {
        categoryId: catDrinks.id,
        name: 'Cà Phê Sữa Đá Gõ Nhịp',
        slug: 'ca-phe-sua-da',
        price: 20000,
        salePrice: null,
        thumbnailUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500',
        stock: 200,
        salesCount: 500,
        isFeatured: true,
      }
    ]
  });

  console.log('✅ Tạo dữ liệu mẫu (Seeding) thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
