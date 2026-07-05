import Image from "next/image";

export default function DashboardPage() {
  return (
    <>
      <h2 className="text-[32px] font-bold text-dark mb-8 tracking-tight">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Total User */}
        <div className="bg-white rounded-[14px] p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[16px] font-semibold text-dark opacity-70 mb-2">Total User</p>
              <h3 className="text-[28px] font-bold text-dark">40,689</h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
              <i className="fa-solid fa-users"></i>
            </div>
          </div>
          <div className="flex items-center text-sm font-semibold mt-6">
            <i className="fa-solid fa-arrow-trend-up text-success mr-2"></i>
            <span className="text-success mr-1">8.5%</span>
            <span className="text-muted font-normal">Up from yesterday</span>
          </div>
        </div>

        {/* Total Order */}
        <div className="bg-white rounded-[14px] p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[16px] font-semibold text-dark opacity-70 mb-2">Total Order</p>
              <h3 className="text-[28px] font-bold text-dark">10293</h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-2xl bg-warning/10 flex items-center justify-center text-warning text-2xl">
              <i className="fa-solid fa-box-open"></i>
            </div>
          </div>
          <div className="flex items-center text-sm font-semibold mt-6">
            <i className="fa-solid fa-arrow-trend-up text-success mr-2"></i>
            <span className="text-success mr-1">1.3%</span>
            <span className="text-muted font-normal">Up from past week</span>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white rounded-[14px] p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[16px] font-semibold text-dark opacity-70 mb-2">Total Sales</p>
              <h3 className="text-[28px] font-bold text-dark">$89,000</h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-2xl bg-success/10 flex items-center justify-center text-success text-2xl">
              <i className="fa-solid fa-chart-line"></i>
            </div>
          </div>
          <div className="flex items-center text-sm font-semibold mt-6">
            <i className="fa-solid fa-arrow-trend-down text-danger mr-2"></i>
            <span className="text-danger mr-1">4.3%</span>
            <span className="text-muted font-normal">Down from yesterday</span>
          </div>
        </div>

        {/* Total Pending */}
        <div className="bg-white rounded-[14px] p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[16px] font-semibold text-dark opacity-70 mb-2">Total Pending</p>
              <h3 className="text-[28px] font-bold text-dark">2040</h3>
            </div>
            <div className="w-[60px] h-[60px] rounded-2xl bg-danger/10 flex items-center justify-center text-danger text-2xl">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
          </div>
          <div className="flex items-center text-sm font-semibold mt-6">
            <i className="fa-solid fa-arrow-trend-up text-success mr-2"></i>
            <span className="text-success mr-1">1.8%</span>
            <span className="text-muted font-normal">Up from yesterday</span>
          </div>
        </div>
      </div>

      {/* Charts & Tables Section */}
      <div className="space-y-8">
        {/* Sales Details */}
        <div className="bg-white rounded-[14px] p-8 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[24px] font-bold text-dark">Sales Details</h3>
            <button className="border border-[#D5D5D5] rounded py-1 px-3 flex items-center gap-2 text-sm font-semibold text-dark opacity-70 hover:bg-gray-50 transition-colors">
              October
              <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
          </div>
          
          <div className="relative h-[300px] w-full flex items-end justify-between px-4 pb-8 border-b border-gray-100">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs font-semibold text-dark opacity-40">
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
            </div>
            
            {/* Graph Mockup */}
            <div className="absolute inset-0 left-10 bottom-8 flex items-end">
              <div className="w-full h-[60%] bg-gradient-to-t from-primary/20 to-transparent rounded-t-full border-t-[3px] border-primary relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-dark text-white text-xs font-bold py-1 px-3 rounded shadow-lg whitespace-nowrap">
                  64,364.77
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-[3px] border-primary rounded-full"></div>
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs font-semibold text-dark opacity-40">
              <span>5k</span><span>10k</span><span>15k</span><span>20k</span><span>25k</span><span>30k</span>
              <span>35k</span><span>40k</span><span>45k</span><span>50k</span><span>55k</span><span>60k</span>
            </div>
          </div>
        </div>

        {/* Deals Details Table */}
        <div className="bg-white rounded-[14px] p-8 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[24px] font-bold text-dark">Deals Details</h3>
            <button className="border border-[#D5D5D5] rounded py-1 px-3 flex items-center gap-2 text-sm font-semibold text-dark opacity-70 hover:bg-gray-50 transition-colors">
              October
              <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F1F4F9] rounded-xl text-dark">
                  <th className="py-4 px-6 font-bold text-[14px] first:rounded-l-xl">Product Name</th>
                  <th className="py-4 px-6 font-bold text-[14px]">Location</th>
                  <th className="py-4 px-6 font-bold text-[14px]">Date - Time</th>
                  <th className="py-4 px-6 font-bold text-[14px]">Piece</th>
                  <th className="py-4 px-6 font-bold text-[14px]">Amount</th>
                  <th className="py-4 px-6 font-bold text-[14px] last:rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <Image src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=100&h=100&q=80" alt="Apple Watch" width={36} height={36} className="w-[36px] h-[36px] rounded-[10px] object-cover bg-gray-200" unoptimized />
                      <span className="font-semibold text-[14px] text-dark opacity-80 group-hover:opacity-100 transition-opacity">Apple Watch</span>
                    </div>
                  </td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">6096 Marjolaine Landing</span></td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">12.09.2026 - 12.53 PM</span></td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">423</span></td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">$34,295</span></td>
                  <td className="py-4 px-6"><span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-success text-white text-[14px] font-bold">Delivered</span></td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <Image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&h=100&q=80" alt="Watch" width={36} height={36} className="w-[36px] h-[36px] rounded-[10px] object-cover bg-gray-200" unoptimized />
                      <span className="font-semibold text-[14px] text-dark opacity-80 group-hover:opacity-100 transition-opacity">Apple Watch</span>
                    </div>
                  </td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">6096 Marjolaine Landing</span></td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">12.09.2026 - 12.53 PM</span></td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">423</span></td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">$34,295</span></td>
                  <td className="py-4 px-6"><span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-warning text-white text-[14px] font-bold">Pending</span></td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <Image src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=100&h=100&q=80" alt="Watch" width={36} height={36} className="w-[36px] h-[36px] rounded-[10px] object-cover bg-gray-200" unoptimized />
                      <span className="font-semibold text-[14px] text-dark opacity-80 group-hover:opacity-100 transition-opacity">Apple Watch</span>
                    </div>
                  </td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">6096 Marjolaine Landing</span></td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">12.09.2026 - 12.53 PM</span></td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">423</span></td>
                  <td className="py-4 px-6"><span className="font-semibold text-[14px] text-dark opacity-80">$34,295</span></td>
                  <td className="py-4 px-6"><span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-danger text-white text-[14px] font-bold">Rejected</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
