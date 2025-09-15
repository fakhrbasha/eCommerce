'use client';
import { apiServices } from '@/services/api';
import { Loader2 } from 'lucide-react';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';

type CartContextType = {
  cartCount?: number;
  setCartCount?: Dispatch<SetStateAction<number>>;
  cartLoading?: boolean;
  handleAddToCart?: (
    productId: string,
    setAddToCartLoading: any
  ) => Promise<void>;
};
export const CartContext = createContext<CartContextType>({});

export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  async function getCard() {
    setCartLoading(true);
    const response = await apiServices.getUserCart();
    setCartCount(response.numOfCartItems);
    setCartLoading(false);
  }

  async function handleAddToCart(productId: string, setAddToCartLoading: any) {
    setAddToCartLoading(true);
    const data = await apiServices.addProductToCart(productId);
    setCartCount(data.numOfCartItems);
    toast.success(data.message);
    setAddToCartLoading(false);
  }
  useEffect(() => {
    getCard();
  }, []);
  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, cartLoading, handleAddToCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
