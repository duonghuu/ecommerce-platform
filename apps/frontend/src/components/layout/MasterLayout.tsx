import React, { ReactNode, Suspense } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";

export default function MasterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pb-xl">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
    </>
  );
}
