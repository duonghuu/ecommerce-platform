import React, { Suspense } from 'react';
import MasterLayout from '@/components/layout/MasterLayout';
import { Banner } from '@/components/products/Banner';
import { ProductListLayout } from '@/components/products/ProductListLayout';

export const metadata = {
  title: 'Thực đơn - TechBite Pro',
  description: 'Khám phá thực đơn đặc biệt dành riêng cho dân IT',
};

async function ProductListData({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const limit = 12;
  const categoryId = resolvedParams.category as string || '';
  const sortBy = resolvedParams.sort as string || 'latest';
  const priceRange = resolvedParams.price as string || '';
  
  let minPrice = '';
  let maxPrice = '';
  if (priceRange === 'under_50k') maxPrice = '50000';
  else if (priceRange === '50k_to_100k') { minPrice = '50000'; maxPrice = '100000'; }
  else if (priceRange === 'over_100k') minPrice = '100000';

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (categoryId) queryParams.append('categoryId', categoryId);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (minPrice) queryParams.append('minPrice', minPrice);
  if (maxPrice) queryParams.append('maxPrice', maxPrice);

  let productsRes;
  let categoriesRes;
  let bannersRes;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const [pRes, cRes, bRes] = await Promise.all([
      fetch(`${apiUrl}/products?${queryParams.toString()}`, { cache: 'no-store' }),
      fetch(`${apiUrl}/categories`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/banners?position=product_list_top`, { next: { revalidate: 3600 } })
    ]);

    if (!pRes.ok) throw new Error('Failed to fetch products');
    if (!cRes.ok) throw new Error('Failed to fetch categories');

    productsRes = await pRes.json();
    categoriesRes = await cRes.json();
    bannersRes = bRes.ok ? await bRes.json() : { data: [] };
  } catch (error) {
    console.error('Error fetching product list data:', error);
    return (
      <div className="bg-red-50 text-red-500 p-8 rounded-xl text-center border border-red-100 my-8">
        <span className="material-symbols-outlined text-4xl mb-2">error</span>
        <h3 className="font-bold text-lg mb-1">Đã xảy ra lỗi</h3>
        <p>Không thể tải danh sách sản phẩm lúc này. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const rawProducts = productsRes?.data?.items || [];
  const pagination = productsRes?.data?.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 };
  const rawCategories = categoriesRes?.data || [];
  const bannerData = bannersRes?.data?.[0];

  const mappedProducts = rawProducts.map((p: any) => {
    const price = Number(p.salePrice) || Number(p.price);
    const originalPrice = p.salePrice ? Number(p.price) : undefined;
    
    return {
      id: p.id,
      name: p.name,
      price,
      originalPrice,
      imageUrl: p.thumbnailUrl || '',
      badges: p.salePrice ? ['Sale'] : p.isFeatured ? ['Nổi bật'] : [],
      description: p.category?.name || 'Món ngon',
    };
  });

  const categoryOptions = rawCategories.map((c: any) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <>
      <Banner 
        title={bannerData?.title} 
        subtitle={bannerData?.subtitle} 
        imageUrl={bannerData?.imageUrl} 
      />
      <ProductListLayout 
        products={mappedProducts} 
        pagination={pagination} 
        categories={categoryOptions} 
        totalItems={pagination.total} 
      />
    </>
  );
}

function ProductListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[240px] bg-slate-200 rounded-xl mb-lg"></div>
      <div className="flex flex-col md:flex-row gap-lg items-start">
        <div className="w-full md:w-64 flex-shrink-0 h-96 bg-slate-200 rounded-xl"></div>
        <div className="flex-grow flex flex-col min-w-0 w-full">
          <div className="w-full h-16 bg-slate-200 rounded-xl mb-md"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductListPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <MasterLayout>
      <div className="pt-8">
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductListData searchParams={searchParams} />
        </Suspense>
      </div>
    </MasterLayout>
  );
}
