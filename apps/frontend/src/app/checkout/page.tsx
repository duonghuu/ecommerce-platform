import React from 'react';
import MasterLayout from '@/components/layout/MasterLayout';
import CheckoutClient from '@/components/checkout/CheckoutClient';
import { getProfileUser } from '../actions/auth';

export const metadata = {
  title: "Thanh toán - TechBite Pro",
  description: "Thanh toán đơn hàng của bạn tại TechBite Pro",
};

export default async function CheckoutPage() {
  const profileRes = await getProfileUser();
  const initialData = profileRes.success ? {
    customerInfo: {
      fullName: profileRes.data.fullName || '',
      email: profileRes.data.email || '',
      phone: profileRes.data.phone || '',
      address: profileRes.data.address || '',
    }
  } : {};
  
  return (
    <MasterLayout>
      <CheckoutClient initialData={initialData} />
    </MasterLayout>
  );
}
