import { redirect } from 'next/navigation';

interface OrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OrdersRedirectPage({ searchParams }: OrdersPageProps) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page;
  if (page) {
    redirect(`/profile/orders?page=${page}`);
  }
  redirect('/profile/orders');
}
