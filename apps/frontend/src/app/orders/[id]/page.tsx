import { redirect } from 'next/navigation';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailRedirectPage({ params }: OrderDetailPageProps) {
  const resolvedParams = await params;
  redirect(`/profile/orders/${resolvedParams.id}`);
}
