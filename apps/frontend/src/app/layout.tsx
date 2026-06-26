import "./globals.css";
import { ReactNode } from "react";
import QueryProvider from "../providers/QueryProvider";

export const metadata = {
  title: "TechBite Pro | Nạp Năng Lượng - Code Phê Hơn",
  description: "Nền tảng cung cấp dinh dưỡng và năng lượng tối ưu cho cộng đồng lập trình viên Việt Nam. Tăng tốc hiệu suất, giảm thiểu bug.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface font-body-md overflow-x-hidden" suppressHydrationWarning>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
