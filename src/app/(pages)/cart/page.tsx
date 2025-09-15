import { apiServices } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '@/helpers/currency';
import CartProduct from '@/components/products/CartProduct';
import InnerCart from './InnerCart';
import { useSession } from 'next-auth/react';
// import { formatPrice } from '@/lib/utils'; // adjust import path

export default async function Cart() {
  async function fetchCart() {
    const response = await apiServices.getUserCart();
    return response;
  }

  const Response = await fetchCart();

  if (!Response || Response.numOfCartItems === 0) {
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <InnerCart cartData={Response} />
    </div>
  );
}
// server component
