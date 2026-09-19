import { PrismaClient, PaymentMethod, OrderStatus, PaymentStatus, DiscountType } from '@prisma/client';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';

config();

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu dọn dẹp dữ liệu cũ...');
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.coupon.deleteMany();

  console.log('Đang tạo dữ liệu mẫu...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 0. Tạo Users
  console.log('Đang tạo Users...');
  const admin = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.create({
    data: {
      fullName: 'Staff User',
      email: 'staff@example.com',
      password: hashedPassword,
      role: 'STAFF',
    },
  });

  const customer = await prisma.user.create({
    data: {
      fullName: 'Customer User',
      email: 'customer@example.com',
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });

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
  const p1 = await prisma.product.create({
    data: {
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
  });

  const p2 = await prisma.product.create({
    data: {
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
  });

  const p3 = await prisma.product.create({
    data: {
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
  });

  const p4 = await prisma.product.create({
    data: {
      categoryId: catDrinks.id,
      name: 'Cà Phê Sữa Đá Gõ Nhịp',
      slug: 'ca-phe-sua-da',
      price: 20000,
      salePrice: null,
      thumbnailUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500',
      stock: 200,
      salesCount: 500,
      isFeatured: true,
    },
  });

  // 4. Tạo Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minOrderValue: 50000,
        maxDiscount: 20000,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true,
      },
      {
        code: 'MINUS20K',
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 20000,
        minOrderValue: 100000,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true,
      },
    ],
  });

  // 5. Tạo Orders & OrderItems mẫu cho Customer (15 đơn để test phân trang 10 items/page & profile 5 items)
  console.log('Đang tạo các đơn hàng mẫu cho Customer...');

  const ordersData = [
    {
      code: 'TB-982341',
      status: OrderStatus.PENDING,
      paymentMethod: PaymentMethod.QR_CODE,
      paymentStatus: PaymentStatus.PENDING,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 60000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 100000,
      daysAgo: 0,
      items: [
        { product: p1, quantity: 1, price: 35000 },
        { product: p3, quantity: 1, price: 25000 },
      ],
    },
    {
      code: 'TB-912847',
      status: OrderStatus.CONFIRMED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      shippingMethod: 'Giao hàng hỏa tốc',
      shippingFee: 40000,
      subTotal: 85000,
      discountAmount: 10000,
      discountCode: 'WELCOME10',
      totalAmount: 115000,
      daysAgo: 1,
      items: [
        { product: p1, quantity: 1, price: 35000 },
        { product: p2, quantity: 2, price: 25000 },
      ],
    },
    {
      code: 'TB-847291',
      status: OrderStatus.SHIPPING,
      paymentMethod: PaymentMethod.QR_CODE,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 70000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 110000,
      daysAgo: 2,
      items: [
        { product: p1, quantity: 2, price: 35000 },
      ],
    },
    {
      code: 'TB-793820',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 95000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 135000,
      daysAgo: 3,
      items: [
        { product: p2, quantity: 1, price: 25000 },
        { product: p3, quantity: 2, price: 25000 },
        { product: p4, quantity: 1, price: 20000 },
      ],
    },
    {
      code: 'TB-728194',
      status: OrderStatus.CANCELLED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.FAILED,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 50000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 90000,
      daysAgo: 4,
      items: [
        { product: p2, quantity: 2, price: 25000 },
      ],
    },
    {
      code: 'TB-682910',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.QR_CODE,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 120000,
      discountAmount: 20000,
      discountCode: 'MINUS20K',
      totalAmount: 140000,
      daysAgo: 6,
      items: [
        { product: p1, quantity: 2, price: 35000 },
        { product: p3, quantity: 2, price: 25000 },
      ],
    },
    {
      code: 'TB-612984',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 75000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 115000,
      daysAgo: 8,
      items: [
        { product: p2, quantity: 3, price: 25000 },
      ],
    },
    {
      code: 'TB-592817',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 40000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 80000,
      daysAgo: 10,
      items: [
        { product: p4, quantity: 2, price: 20000 },
      ],
    },
    {
      code: 'TB-510293',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.QR_CODE,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 85000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 125000,
      daysAgo: 12,
      items: [
        { product: p1, quantity: 1, price: 35000 },
        { product: p2, quantity: 1, price: 25000 },
        { product: p3, quantity: 1, price: 25000 },
      ],
    },
    {
      code: 'TB-471928',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 60000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 100000,
      daysAgo: 14,
      items: [
        { product: p1, quantity: 1, price: 35000 },
        { product: p3, quantity: 1, price: 25000 },
      ],
    },
    {
      code: 'TB-391827',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 50000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 90000,
      daysAgo: 16,
      items: [
        { product: p3, quantity: 2, price: 25000 },
      ],
    },
    {
      code: 'TB-328190',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.QR_CODE,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 45000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 85000,
      daysAgo: 19,
      items: [
        { product: p2, quantity: 1, price: 25000 },
        { product: p4, quantity: 1, price: 20000 },
      ],
    },
    {
      code: 'TB-281947',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 70000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 110000,
      daysAgo: 22,
      items: [
        { product: p1, quantity: 2, price: 35000 },
      ],
    },
    {
      code: 'TB-219483',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 95000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 135000,
      daysAgo: 25,
      items: [
        { product: p1, quantity: 1, price: 35000 },
        { product: p2, quantity: 1, price: 25000 },
        { product: p3, quantity: 1, price: 25000 },
        { product: p4, quantity: 1, price: 20000 },
      ],
    },
    {
      code: 'TB-158291',
      status: OrderStatus.COMPLETED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      shippingMethod: 'Giao hàng tiêu chuẩn',
      shippingFee: 40000,
      subTotal: 65000,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 105000,
      daysAgo: 28,
      items: [
        { product: p1, quantity: 1, price: 35000 },
        { product: p4, quantity: 1, price: 20000 },
      ],
    },
  ];

  for (const o of ordersData) {
    const createdDate = new Date(Date.now() - o.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.order.create({
      data: {
        code: o.code,
        userId: customer.id,
        customerName: 'Customer User',
        customerPhone: '0987654321',
        customerEmail: 'customer@example.com',
        shippingAddress: 'Tầng 12, Tòa nhà FPT, Cầu Giấy, Hà Nội',
        shippingMethod: o.shippingMethod,
        shippingFee: o.shippingFee,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        status: o.status,
        subTotal: o.subTotal,
        discountAmount: o.discountAmount,
        discountCode: o.discountCode,
        totalAmount: o.totalAmount,
        notes: 'Giao hàng giờ hành chính',
        createdAt: createdDate,
        updatedAt: createdDate,
        items: {
          create: o.items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.thumbnailUrl,
            price: item.price,
            quantity: item.quantity,
            createdAt: createdDate,
            updatedAt: createdDate,
          })),
        },
      },
    });
  }

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
