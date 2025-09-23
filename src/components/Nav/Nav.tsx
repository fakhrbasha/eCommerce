'use client';

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { Button } from '../ui';
import { Loader2, LogOutIcon, ShoppingCart } from 'lucide-react';
import { CartContext } from '@/contexts/CartContext';

export function NavbarDemo() {
  const navItems = [
    { name: 'Products', link: '/products' },
    { name: 'Brands', link: '/brands' },
    { name: 'Categories', link: '/categories' },
    { name: 'Cart', link: '/cart' },
    { name: 'Wish List', link: '/wishlist' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: sessionData, status } = useSession();
  const { cartLoading, cartCount } = useContext(CartContext);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-neutral-900 shadow">
      <Navbar>
        <NavBody>
          <NavbarLogo />

          {status === 'loading' ? (
            <Loader2 className="animate-spin" />
          ) : status === 'authenticated' ? (
            <>
              {/* Desktop Nav Items */}
              <NavItems
                items={navItems.map((item) => ({
                  name: item.name,
                  link: item.link,
                }))}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />

              <div className="flex items-center gap-2">
                {/* Shopping Cart */}
                <Link href="/cart" passHref>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-700 text-xs text-primary-foreground flex items-center justify-center">
                      {cartLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        cartCount
                      )}
                    </span>
                    <span className="sr-only">Shopping cart</span>
                  </Button>
                </Link>

                {/* Logout */}
                <Button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <LogOutIcon />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link href="/auth/login" passHref>
                <NavbarButton variant="secondary">Login</NavbarButton>
              </Link>
              <Link href="/auth/register" passHref>
                <NavbarButton variant="secondary">Register</NavbarButton>
              </Link>
            </div>
          )}
        </NavBody>

        {/* Mobile Nav */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            {status === 'authenticated' && (
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            )}
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                passHref
                className="relative text-neutral-600 dark:text-neutral-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Logout Button for Mobile */}
            {status === 'authenticated' && (
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="ghost"
                size="icon"
                className="mt-2 flex items-center gap-2"
              >
                <LogOutIcon />
                Logout
              </Button>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
