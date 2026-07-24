import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/detail/ProductDetailClient';
import MasterLayout from '@/components/layout/MasterLayout';

async function getProduct(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3302/api/v1';
  try {
    const res = await fetch(`${apiUrl}/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return null;
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch product", error);
    return null;
  }
}

async function getRelatedProducts(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3302/api/v1';
  try {
    const res = await fetch(`${apiUrl}/products/${slug}/related?limit=4`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return res.json();
  } catch (error) {
    console.error("Failed to fetch related products", error);
    return { data: [] };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const productData = await getProduct(slug);
  
  if (!productData || !productData.data) {
    notFound();
  }

  const relatedData = await getRelatedProducts(slug);

  return (
    <MasterLayout>
      <div className="pt-8 bg-slate-50 min-h-screen">
        <ProductDetailClient 
          product={productData.data} 
          relatedProducts={relatedData.data || []} 
        />
      </div>
    </MasterLayout>
  );
}
