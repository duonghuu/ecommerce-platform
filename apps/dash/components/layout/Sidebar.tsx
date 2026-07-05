"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { group: "MAIN" },
  { label: "Dashboard", icon: "fa-solid fa-chart-pie", url: "/" },
  { label: "Products", icon: "fa-solid fa-box", url: "/products" },
  { label: "Favorites", icon: "fa-regular fa-heart", url: "/favorites" },
  { label: "Inbox", icon: "fa-regular fa-message", url: "/inbox" },
  { label: "Order Lists", icon: "fa-solid fa-list-check", url: "/orders" },
  { label: "Product Stock", icon: "fa-solid fa-cubes", url: "/stock" },
  { group: "PAGES" },
  { label: "Pricing", icon: "fa-solid fa-tag", url: "/pricing" },
  { label: "Calendar", icon: "fa-regular fa-calendar", url: "/calendar" },
  { label: "To-Do", icon: "fa-solid fa-clipboard-list", url: "/todo" },
  { label: "Contact", icon: "fa-regular fa-address-book", url: "/contact" },
  { label: "Invoice", icon: "fa-solid fa-file-invoice", url: "/invoice" },
  { label: "UI Elements", icon: "fa-solid fa-layer-group", url: "/ui-elements" },
  { label: "Team", icon: "fa-solid fa-users", url: "/team" },
  { label: "Table", icon: "fa-solid fa-table", url: "/table" },
  { group: "DIVIDER" },
  { label: "Settings", icon: "fa-solid fa-gear", url: "/settings" },
  { label: "Logout", icon: "fa-solid fa-right-from-bracket", url: "/logout" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col h-full shrink-0 z-20">
      <div className="h-[70px] flex items-center justify-center border-b border-gray-100 shrink-0">
        <Link href="/">
          <h1 className="text-[20px] font-extrabold tracking-tight">
            <span className="text-primary">Dash</span><span className="text-dark">Stack</span>
          </h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scroll py-4">
        <nav className="px-4 space-y-1">
          {navItems.map((item, index) => {
            if (item.group === "MAIN") return null;
            if (item.group === "DIVIDER") {
              return <div key={index} className="my-4 border-t border-gray-100"></div>;
            }
            if (item.group) {
              return (
                <div key={index} className="pt-6 pb-2 px-4">
                  <p className="text-[12px] font-bold text-dark opacity-60 tracking-wider uppercase">{item.group}</p>
                </div>
              );
            }

            const isActive = pathname === item.url;

            if (isActive) {
              return (
                <Link key={index} href={item.url!} className="flex items-center gap-4 px-4 py-3 bg-primary text-white rounded-xl mb-2">
                  <i className={`${item.icon} w-5 text-center text-lg`}></i>
                  <span className="font-semibold text-[14px]">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link key={index} href={item.url!} className="flex items-center gap-4 px-4 py-3 text-dark hover:bg-gray-50 rounded-xl transition-colors group">
                <i className={`${item.icon} w-5 text-center text-lg opacity-70 group-hover:opacity-100 transition-opacity`}></i>
                <span className="font-semibold text-[14px] opacity-70 group-hover:opacity-100 transition-opacity">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
