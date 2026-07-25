import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addCartItemServer, updateCartItemServer, removeCartItemServer, getCartServer, syncCartServer } from '@/app/actions/cart';

export interface ICartItem {
  id: string; // productId
  name: string;
  thumbnailUrl: string;
  price: number;
  quantity: number;
  stock?: number;
  isStockError?: boolean;
}

interface CartState {
  cartItems: ICartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  
  fetchCart: () => Promise<void>;
  addItem: (item: ICartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  increaseQuantity: (id: string) => Promise<void>;
  decreaseQuantity: (id: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  clearError: () => void;
  
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isLoading: false,
      isSyncing: false,
      error: null,

      clearError: () => set({ error: null }),

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        const res = await getCartServer();
        if (res.success && res.data) {
          const items: ICartItem[] = res.data.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            thumbnailUrl: item.product.thumbnailUrl,
            price: item.product.salePrice || item.product.price,
            quantity: item.quantity,
            stock: item.product.stock,
            isStockError: item.isStockError,
          }));
          set({ cartItems: items, isLoading: false });
        } else {
          // Guest mode uses local storage naturally, just stop loading
          set({ isLoading: false });
        }
      },

      addItem: async (newItem) => {
        set({ isLoading: true, error: null });
        
        const existingItem = get().cartItems.find(item => item.id === newItem.id);
        const newQuantity = existingItem ? existingItem.quantity + newItem.quantity : newItem.quantity;
        
        const res = await addCartItemServer(newItem.id, newItem.quantity);
        if (res.success && res.data) {
          const items: ICartItem[] = res.data.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            thumbnailUrl: item.product.thumbnailUrl,
            price: item.product.salePrice || item.product.price,
            quantity: item.quantity,
            stock: item.product.stock,
            isStockError: item.isStockError,
          }));
          set({ cartItems: items, isLoading: false });
        } else if (res.status === 401) {
          // Guest Mode
          if (existingItem) {
            set({
              cartItems: get().cartItems.map(item =>
                item.id === newItem.id ? { ...item, quantity: newQuantity } : item
              ),
              isLoading: false
            });
          } else {
            set({ cartItems: [...get().cartItems, newItem], isLoading: false });
          }
        } else {
          set({ error: res.message || 'Lỗi thêm vào giỏ hàng', isLoading: false });
        }
      },

      removeItem: async (id) => {
        set({ isLoading: true, error: null });
        
        const res = await removeCartItemServer(id);
        if (res.success && res.data) {
          const items: ICartItem[] = res.data.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            thumbnailUrl: item.product.thumbnailUrl,
            price: item.product.salePrice || item.product.price,
            quantity: item.quantity,
            stock: item.product.stock,
            isStockError: item.isStockError,
          }));
          set({ cartItems: items, isLoading: false });
        } else if (res.status === 401) {
          set({
            cartItems: get().cartItems.filter(item => item.id !== id),
            isLoading: false
          });
        } else {
          set({ error: res.message || 'Lỗi xóa sản phẩm', isLoading: false });
        }
      },

      increaseQuantity: async (id) => {
        set({ isLoading: true, error: null });
        const item = get().cartItems.find(i => i.id === id);
        if (!item) {
          set({ isLoading: false });
          return;
        }
        
        const newQuantity = item.quantity + 1;
        
        const res = await updateCartItemServer(id, newQuantity);
        if (res.success && res.data) {
          const items: ICartItem[] = res.data.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            thumbnailUrl: item.product.thumbnailUrl,
            price: item.product.salePrice || item.product.price,
            quantity: item.quantity,
            stock: item.product.stock,
            isStockError: item.isStockError,
          }));
          set({ cartItems: items, isLoading: false });
        } else if (res.status === 401) {
          set({
            cartItems: get().cartItems.map(i =>
              i.id === id ? { ...i, quantity: newQuantity } : i
            ),
            isLoading: false
          });
        } else {
          set({ error: res.message || 'Lỗi cập nhật số lượng', isLoading: false });
        }
      },

      decreaseQuantity: async (id) => {
        set({ isLoading: true, error: null });
        const item = get().cartItems.find(i => i.id === id);
        if (!item || item.quantity <= 1) {
          set({ isLoading: false });
          return;
        }
        
        const newQuantity = item.quantity - 1;
        
        const res = await updateCartItemServer(id, newQuantity);
        if (res.success && res.data) {
          const items: ICartItem[] = res.data.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            thumbnailUrl: item.product.thumbnailUrl,
            price: item.product.salePrice || item.product.price,
            quantity: item.quantity,
            stock: item.product.stock,
            isStockError: item.isStockError,
          }));
          set({ cartItems: items, isLoading: false });
        } else if (res.status === 401) {
          set({
            cartItems: get().cartItems.map(i =>
              i.id === id ? { ...i, quantity: newQuantity } : i
            ),
            isLoading: false
          });
        } else {
          set({ error: res.message || 'Lỗi cập nhật số lượng', isLoading: false });
        }
      },

      clearCart: () => set({ cartItems: [] }),

      syncCart: async () => {
        const localItems = get().cartItems;
        if (localItems.length === 0) {
           await get().fetchCart();
           return;
        }
        
        set({ isSyncing: true });
        const payload = localItems.map(item => ({ productId: item.id, quantity: item.quantity }));
        const res = await syncCartServer(payload);
        
        if (res.success && res.data) {
          const items: ICartItem[] = res.data.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            thumbnailUrl: item.product.thumbnailUrl,
            price: item.product.salePrice || item.product.price,
            quantity: item.quantity,
            stock: item.product.stock,
            isStockError: item.isStockError,
          }));
          set({ cartItems: items, isSyncing: false });
        } else {
          set({ isSyncing: false });
        }
      },

      getTotalItems: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
