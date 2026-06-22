import { create } from 'zustand';

export interface ICartItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  price: number;
  quantity: number;
}

interface CartState {
  cartItems: ICartItem[];
  addItem: (item: ICartItem) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

// Initial mock data based on design
const initialCartItems: ICartItem[] = [
  {
    id: 'item_1',
    name: 'Chuột không dây Logitech MX Master 3S',
    // Ảnh chụp cận cảnh chuột máy tính cao cấp trên Unsplash
    thumbnailUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=150&h=150&q=80',
    price: 2490000,
    quantity: 1,
  },
  {
    id: 'item_2',
    name: 'Bàn phím cơ Keychron K8 Pro Nhôm',
    // Ảnh chụp góc làm việc có bàn phím cơ trên Unsplash
    thumbnailUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=150&h=150&q=80',
    price: 2150000,
    quantity: 1,
  },
];

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: initialCartItems,

  addItem: (newItem) => set((state) => {
    const existingItem = state.cartItems.find(item => item.id === newItem.id);
    if (existingItem) {
      return {
        cartItems: state.cartItems.map(item =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        )
      };
    }
    return { cartItems: [...state.cartItems, newItem] };
  }),

  removeItem: (id) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== id)
  })),

  increaseQuantity: (id) => set((state) => ({
    cartItems: state.cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
  })),

  decreaseQuantity: (id) => set((state) => ({
    cartItems: state.cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    )
  })),

  clearCart: () => set({ cartItems: [] }),

  getTotalItems: () => {
    return get().cartItems.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
