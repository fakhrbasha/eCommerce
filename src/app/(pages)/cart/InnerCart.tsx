'use client';
import { Button } from '@/components';
import CartProduct from '@/components/products/CartProduct';
import { CartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/helpers/currency';
import { GetUserCartResponse } from '@/interfaces';
import { apiServices } from '@/services/api';
import { Separator } from '@radix-ui/react-separator';
import { Loader2, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
interface cartDataProp {
  cartData: GetUserCartResponse;
}

export default function InnerCart({ cartData }: cartDataProp) {
  const { data } = useSession();
  const [innerCartData, setInnerCartData] =
    useState<GetUserCartResponse>(cartData);
  const [isCartClear, setIsCartClear] = useState(false);
  const [isCheckOut, setIsCheckOut] = useState(false);
  const { setCartCount } = useContext(CartContext);

  async function getNewCartItems() {
    const newProductCart = await apiServices.getUserCart(data?.token!);
    setInnerCartData(newProductCart);
  }
  async function handleRemoveCartProduct(
    productId: string,
    setIsRemovingProduct: (value: boolean) => void
  ) {
    setIsRemovingProduct(true);
    const response = await apiServices.removeSpecificItem(
      productId,
      data?.token!
    );
    getNewCartItems();
    // console.log(response);
    toast.success('Product removed from cart', { position: 'bottom-right' });
    setIsRemovingProduct(false);
  }
  async function handleUpdateProductCartCount(
    productId: string,
    count: number
  ) {
    // setIsUpdating(true);
    const response = await apiServices.updateCartCount(
      productId,
      count,
      data?.token!
    );
    getNewCartItems();
    // setIsUpdating(false);
    // console.log(response);
  }

  async function handleClearCart() {
    setIsCartClear(true);
    const response = await apiServices.clearCart(data?.token!);
    getNewCartItems();

    toast.success('Cart cleared', { position: 'bottom-right' });
    setIsCartClear(false);
  }

  async function handleCheckOut() {
    setIsCheckOut(true);
    const response = await apiServices.checkout(cartData.cartId, data?.token!);
    setIsCheckOut(false);
    location.href = response.session.url;
  }
  useEffect(() => {
    setCartCount!(innerCartData.numOfCartItems);
  }, [innerCartData]);
  if (!innerCartData || innerCartData.numOfCartItems === 0) {
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
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        {innerCartData.numOfCartItems > 0 && (
          <p className="text-muted-foreground">
            {innerCartData.numOfCartItems} item
            {innerCartData.numOfCartItems > 1 ? 's' : ''} in your cart
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {innerCartData.data.products.map((item) => (
              <CartProduct
                handleUpdateProductCartCount={handleUpdateProductCartCount}
                key={item._id}
                handleRemoveCartProduct={handleRemoveCartProduct}
                item={item}
              />
            ))}
          </div>

          {/* Clear Cart */}
          <div className="mt-6">
            <Button
              disabled={isCartClear}
              variant="outline"
              onClick={handleClearCart}
            >
              {isCartClear ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({innerCartData.numOfCartItems} items)</span>
                <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
            </div>

            <Button
              disabled={isCheckOut}
              // onClick={() => {
              //   handleCheckOut();
              // }}
              className="w-full"
              size="lg"
            >
              {isCheckOut && <Loader2 className="animate-spin" />}
              <Link href={'/address'}>Proceed to Checkout</Link>
            </Button>

            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
