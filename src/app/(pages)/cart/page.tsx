'use client';

import { apiServices } from '@/services/api';
import InnerCart from './InnerCart';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSpinner } from '@/components';

export default function Cart() {
  const { data: session } = useSession();
  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      if (!session?.token) return;
      const response = await apiServices.getUserCart(session.token);
      setCartData(response);
      setLoading(false);
    }
    fetchCart();
  }, [session]);

  if (loading) return <LoadingSpinner />;

  if (!cartData || cartData.numOfCartItems === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          No product in your cart
        </h2>
        <Button variant="outline" className="w-fit mt-2" asChild>
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="custom-container mx-auto px-4">
      <InnerCart cartData={cartData} />
    </div>
  );
}
