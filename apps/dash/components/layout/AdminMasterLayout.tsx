import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AdminMasterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden text-dark antialiased bg-[#F5F6FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
