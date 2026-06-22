import React, { Suspense } from "react";
import MasterLayout from "@/components/layout/MasterLayout";
import HeroBanner from "@/components/ui/HeroBanner";
import CategorySection from "@/components/ui/CategorySection";
import FeaturedMenu from "@/components/ui/FeaturedMenu";
import SocialProofBanner from "@/components/ui/SocialProofBanner";

async function HomeData() {
  let response;
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/home`
        : "http://localhost:3001/api/v1/home",
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      throw new Error("Không thể tải dữ liệu trang chủ");
    }
    response = await res.json();
  } catch (error) {
    console.log('error', error);
    return (
      <div className="bg-red-50 text-red-500 p-8 rounded-xl text-center mt-8 border border-red-100">
        <span className="material-symbols-outlined text-4xl mb-2">error</span>
        <h3 className="font-bold text-lg mb-1">Đã xảy ra lỗi</h3>
        <p>Không thể tải dữ liệu trang chủ lúc này. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const data = response?.data;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-xl mt-8 border border-surface-variant">
        <span className="material-symbols-outlined text-6xl text-slate-300">inbox</span>
        <p className="mt-4 text-slate-500 font-body-lg">Chưa có dữ liệu trang chủ</p>
      </div>
    );
  }

  const hasData =
    data.heroBanners?.length > 0 ||
    data.featuredCategories?.length > 0 ||
    data.featuredProducts?.length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-xl mt-8 border border-surface-variant">
        <span className="material-symbols-outlined text-6xl text-slate-300">inbox</span>
        <p className="mt-4 text-slate-500 font-body-lg">
          Chưa có dữ liệu. Vui lòng thêm dữ liệu từ admin.
        </p>
      </div>
    );
  }

  const heroBannerData = data.heroBanners?.[0] || null;
  const categories = (data.featuredCategories || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    icon: c.iconUrl,
    slug: c.slug,
    countText: "Khám phá ngay",
  }));

  const products = (data.featuredProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.salePrice ? p.price : undefined,
    imageUrl: p.thumbnailUrl,
    badges: p.salePrice ? ["Sale"] : undefined,
    description: "Hương vị hấp dẫn",
  }));

  return (
    <>
      {heroBannerData && (
        <HeroBanner
          title={heroBannerData.title}
          subtitle={heroBannerData.subtitle || ""}
          imageUrl={heroBannerData.imageUrl}
          ctaText="Mua ngay"
          onCtaClick={async () => {
            "use server";
            // TODO: Implement CTA action
            console.log("Hero CTA clicked");
          }}
        />
      )}

      {/* Delivery Promise Banner */}
      <section className="mt-lg py-md px-xl bg-surface-container-highest border border-surface-variant rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-md">
          <div className="bg-primary text-on-primary p-sm rounded-full flex items-center justify-center">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              speed
            </span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Giao hàng 15p
            </h3>
            <p className="text-secondary font-body-md text-body-md">
              Nhanh hơn một lệnh 'git push' thất bại.
            </p>
          </div>
        </div>
        <div className="h-10 w-px bg-surface-variant hidden md:block"></div>
        <div className="hidden md:flex items-center gap-md">
          <span className="material-symbols-outlined text-primary">verified</span>
          <span className="font-body-md text-body-md text-on-surface">
            Đảm bảo độ tươi 100%
          </span>
        </div>
        <div className="h-10 w-px bg-surface-variant hidden md:block"></div>
        <div className="hidden md:flex items-center gap-md">
          <span className="material-symbols-outlined text-primary">
            support_agent
          </span>
          <span className="font-body-md text-body-md text-on-surface">
            Support 24/7 Dev team
          </span>
        </div>
      </section>

      {categories.length > 0 && <CategorySection categories={categories} />}

      {products.length > 0 && <FeaturedMenu products={products} />}

      {data.socialProof && (
        <SocialProofBanner
          title="Gia nhập TechBite Elite"
          description={data.socialProof.message}
          benefits={["Free ship 5km", "Hoàn tiền 5%", "Menu ẩn cho Dev"]}
        />
      )}
    </>
  );
}

function HomeLoadingSkeleton() {
  return (
    <div className="animate-pulse mt-8">
      {/* Hero Skeleton */}
      <div className="w-full h-[520px] bg-slate-200 rounded-xl mb-12"></div>
      {/* Banner Skeleton */}
      <div className="w-full h-24 bg-slate-200 rounded-xl mb-12"></div>
      {/* Category Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="h-32 bg-slate-200 rounded-xl"></div>
        <div className="h-32 bg-slate-200 rounded-xl"></div>
        <div className="h-32 bg-slate-200 rounded-xl"></div>
        <div className="h-32 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <MasterLayout>
      <Suspense fallback={<HomeLoadingSkeleton />}>
        <HomeData />
      </Suspense>
    </MasterLayout>
  );
}
