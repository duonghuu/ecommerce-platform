import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/products/detail/ProductDetailClient';
import MasterLayout from '@/components/layout/MasterLayout';

async function getProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:3001/api/v1/products/${id}`, { cache: 'no-store' });
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

async function getRelatedProducts(id: string) {
  try {
    const res = await fetch(`http://localhost:3001/api/v1/products/${id}/related?limit=4`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return res.json();
  } catch (error) {
    console.error("Failed to fetch related products", error);
    return { data: [] };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productData = await getProduct(id);
  
  if (!productData || !productData.data) {
    notFound();
  }

  const relatedData = await getRelatedProducts(id);

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
