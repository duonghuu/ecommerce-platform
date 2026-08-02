import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface CustomerInfoFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function CustomerInfoForm({ register, errors }: CustomerInfoFormProps) {
  return (
    <div className="space-y-md">
      {/* Customer Info */}
      <section className="bg-white p-md rounded-2xl border border-slate-200">
        <h2 className="text-headline-sm font-bold mb-md flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">person</span>
          Thông tin khách hàng
        </h2>
        <div className="space-y-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="text-label-md text-on-surface-variant">Họ và tên</label>
              <input 
                className={`w-full bg-white border ${errors.fullName ? 'border-error' : 'border-slate-200'} rounded-xl px-4 py-3 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/10`} 
                placeholder="Nguyễn Văn A" 
                type="text" 
                {...register("fullName")}
              />
              {errors.fullName && <p className="text-error text-label-md">{errors.fullName.message as string}</p>}
            </div>
            <div className="space-y-xs">
              <label className="text-label-md text-on-surface-variant">Số điện thoại</label>
              <input 
                className={`w-full bg-white border ${errors.phone ? 'border-error' : 'border-slate-200'} rounded-xl px-4 py-3 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/10`} 
                placeholder="0901 234 567" 
                type="tel" 
                {...register("phone")}
              />
              {errors.phone && <p className="text-error text-label-md">{errors.phone.message as string}</p>}
            </div>
          </div>
          <div className="space-y-xs">
            <label className="text-label-md text-on-surface-variant">Email (Không bắt buộc)</label>
            <input 
              className={`w-full bg-white border ${errors.email ? 'border-error' : 'border-slate-200'} rounded-xl px-4 py-3 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/10`} 
              placeholder="dev@techbite.pro" 
              type="email" 
              {...register("email")}
            />
            {errors.email && <p className="text-error text-label-md">{errors.email.message as string}</p>}
          </div>
          <div className="space-y-xs">
            <label className="text-label-md text-on-surface-variant">Địa chỉ giao hàng</label>
            <input 
              className={`w-full bg-white border ${errors.address ? 'border-error' : 'border-slate-200'} rounded-xl px-4 py-3 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/10`} 
              placeholder="Số nhà, Tên đường, Phường/Xã..." 
              type="text" 
              {...register("address")}
            />
            {errors.address && <p className="text-error text-label-md">{errors.address.message as string}</p>}
          </div>
          <div className="space-y-xs">
            <label className="text-label-md text-on-surface-variant">Ghi chú cho đơn hàng</label>
            <textarea 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/10 resize-none" 
              placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..." 
              rows={3}
              {...register("orderNotes")}
            ></textarea>
          </div>
        </div>
      </section>

      {/* Shipping Method */}
      <section className="bg-white p-md rounded-2xl border border-slate-200">
        <h2 className="text-headline-sm font-bold mb-md flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">local_shipping</span>
          Phương thức vận chuyển
        </h2>
        <div className="space-y-sm">
          <div className="relative">
            <input 
              className="hidden peer" 
              id="ship-standard" 
              type="radio" 
              value="standard"
              {...register("shippingMethod")}
            />
            <label 
              className="flex items-center justify-between p-md border border-slate-200 rounded-xl cursor-pointer transition-all hover:bg-slate-50 peer-checked:border-primary-container peer-checked:bg-orange-50" 
              htmlFor="ship-standard"
            >
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-slate-400">delivery_dining</span>
                <div>
                  <p className="font-semibold">Giao hàng tiêu chuẩn</p>
                  <p className="text-body-md text-on-surface-variant">Dự kiến nhận hàng sau 2-3 ngày</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">40.000đ</span>
            </label>
          </div>
          <div className="relative opacity-60">
            <input 
              className="hidden peer" 
              disabled 
              id="ship-fast" 
              type="radio" 
              value="fast"
            />
            <label 
              className="flex items-center justify-between p-md border border-slate-200 rounded-xl cursor-not-allowed bg-slate-50" 
              htmlFor="ship-fast"
            >
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-slate-400">bolt</span>
                <div>
                  <p className="font-semibold text-slate-400">Giao hàng hỏa tốc (2h)</p>
                  <p className="text-body-md text-slate-400">Chỉ áp dụng khu vực nội thành</p>
                </div>
              </div>
              <span className="text-slate-400">Tạm ngắt</span>
            </label>
          </div>
        </div>
      </section>
      
      {/* Payment Method */}
      <section className="bg-white p-md rounded-2xl border border-slate-200">
        <h2 className="text-headline-sm font-bold mb-md flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary">payments</span>
          Phương thức thanh toán
        </h2>
        <div className="space-y-sm">
          <div className="relative">
            <input 
              className="hidden peer" 
              id="pay-cod" 
              type="radio" 
              value="COD"
              {...register("paymentMethod")}
            />
            <label 
              className="flex items-center gap-sm p-md border border-slate-200 rounded-xl cursor-pointer transition-all hover:bg-slate-50 peer-checked:border-primary-container peer-checked:bg-orange-50" 
              htmlFor="pay-cod"
            >
              <span className="material-symbols-outlined text-slate-400">handshake</span>
              <div>
                <p className="font-semibold">Thanh toán khi nhận hàng (COD)</p>
                <p className="text-body-md text-on-surface-variant">Thanh toán bằng tiền mặt khi shipper giao tới</p>
              </div>
            </label>
          </div>
          <div className="relative">
            <input 
              className="hidden peer" 
              id="pay-qr" 
              type="radio" 
              value="QR_CODE"
              {...register("paymentMethod")}
            />
            <label 
              className="flex items-center gap-sm p-md border border-slate-200 rounded-xl cursor-pointer transition-all hover:bg-slate-50 peer-checked:border-primary-container peer-checked:bg-orange-50" 
              htmlFor="pay-qr"
            >
              <span className="material-symbols-outlined text-slate-400">qr_code_2</span>
              <div>
                <p className="font-semibold">Chuyển khoản qua mã QR</p>
                <p className="text-body-md text-on-surface-variant">Tất cả ngân hàng và ví điện tử MoMo, ZaloPay</p>
              </div>
            </label>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-sm px-xs py-sm">
        <input 
          className="w-5 h-5 rounded text-primary-container focus:ring-primary-container border-slate-300" 
          id="terms" 
          type="checkbox"
          {...register("termsAccepted")}
        />
        <label className="text-body-md text-on-surface-variant flex-1" htmlFor="terms">
          Tôi đã đọc và đồng ý với <a className="text-primary font-semibold hover:underline" href="#">điều khoản dịch vụ</a> của TechBite Pro.
        </label>
      </div>
      {errors.termsAccepted && <p className="text-error text-label-md px-xs">Vui lòng đồng ý với điều khoản dịch vụ.</p>}
    </div>
  );
}
