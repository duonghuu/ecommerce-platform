import type { Metadata } from "next";
import "./globals.css";

import { AdminMasterLayout } from "@/components/layout/AdminMasterLayout";

export const metadata: Metadata = {
  title: "DashStack - Admin Dashboard",
  description: "Dashboard for e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body suppressHydrationWarning>
        <AdminMasterLayout>
          {children}
        </AdminMasterLayout>
      </body>
    </html>
  );
}
