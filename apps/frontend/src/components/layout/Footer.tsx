import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-surface-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-md px-margin-mobile md:px-margin-desktop py-lg max-w-[1440px] mx-auto">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
            TechBite Pro
          </span>
          <p className="mt-md text-secondary font-body-md text-body-md">
            Nền tảng cung cấp dinh dưỡng và năng lượng tối ưu cho cộng đồng lập trình viên Việt Nam. Tăng tốc hiệu suất, giảm thiểu bug.
          </p>
          <div className="flex gap-sm mt-md">
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">public</span>
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">alternate_email</span>
            </Link>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-md">Công ty</h4>
          <ul className="flex flex-col gap-sm">
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Partner with Us
              </Link>
            </li>
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Press
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-md">Pháp lý</h4>
          <ul className="flex flex-col gap-sm">
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Accessibility
              </Link>
            </li>
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Cookie Settings
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-md">Hỗ trợ</h4>
          <ul className="flex flex-col gap-sm">
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Trung tâm trợ giúp
              </Link>
            </li>
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Liên hệ Dev Team
              </Link>
            </li>
            <li>
              <Link href="#" className="text-secondary font-body-md text-body-md hover:text-primary transition-colors">
                Phản hồi
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter/App */}
        <div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-md">Tải ứng dụng</h4>
          <div className="flex flex-col gap-sm">
            <div className="bg-on-surface text-white px-md py-xs rounded flex items-center gap-xs cursor-pointer hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">phone_iphone</span>
              <span className="font-label-md text-label-md">App Store</span>
            </div>
            <div className="bg-on-surface text-white px-md py-xs rounded flex items-center gap-xs cursor-pointer hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">shop</span>
              <span className="font-label-md text-label-md">Google Play</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-variant max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-md flex flex-col md:flex-row justify-between items-center text-secondary">
        <span className="font-label-md text-label-md">© 2024 TechBite Pro. Optimized for performance.</span>
        <div className="flex gap-md mt-sm md:mt-0">
          <span className="flex items-center gap-xs font-label-md text-label-md">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> System Status: Online
          </span>
          <span className="font-label-md text-label-md">v2.4.0-stable</span>
        </div>
      </div>
    </footer>
  );
}
