'use client';
import { apiServices } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  async function getCard() {
    try {
      setCartLoading(true);
      const response = await apiServices.getUserCart(session?.token!);
      setCartCount(response.numOfCartItems || 0);
    } catch (error) {
      console.error('Failed to fetch cart', error);
      setCartCount(0);
    } finally {
      setCartLoading(false);
    }
  }

  async function handleAddToCart(productId: string, setAddToCartLoading: any) {
    setAddToCartLoading(true);
    const data = await apiServices.addProductToCart(productId, session?.token!);
    setCartCount(data.numOfCartItems);
    toast.success(data.message);
    setAddToCartLoading(false);
  }
  useEffect(() => {
    if (session?.token) {
      getCard();
    } else {
      setCartCount(0);
      setCartLoading(false);
    }
  }, [session]);
  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, cartLoading, handleAddToCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
