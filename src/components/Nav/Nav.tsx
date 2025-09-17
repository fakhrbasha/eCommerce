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
import { Loader2, LogOut, LogOutIcon, ShoppingCart, User } from 'lucide-react';
import { CartContext } from '@/contexts/CartContext';
export function NavbarDemo() {
  const navItems = [
    { name: 'Product', link: '/products' },
    { name: 'Brands', link: '/brands' },
    { name: 'Category', link: '/categories' },
    { name: 'Cart', link: '/cart' },
    { name: 'Wish List', link: '/wishlist' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, status } = useSession();
  const { cartLoading, cartCount } = useContext(CartContext);

  // console.log(session);
  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-neutral-900 shadow">
        <Navbar>
          <NavBody>
            <NavbarLogo />

            {status == 'loading' ? (
              'Loading..'
            ) : status == 'authenticated' ? (
              <>
                <NavItems items={navItems} />
                <div className="p-0 m-0 flex justify-center items-center gap-2 ">
                  {/* Shopping Cart */}
                  <Link href={'/cart'}>
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                        {cartLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          cartCount
                        )}
                      </span>
                      <span className="sr-only">Shopping cart</span>
                    </Button>
                  </Link>
                  {/* <p>{data.user.name}</p> */}
                  <Button
                    onClick={() => {
                      signOut();
                    }}
                    variant="ghost"
                    size="icon"
                    className="relative"
                  >
                    <LogOutIcon />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href={'/auth/login'}>
                  <NavbarButton variant="secondary">Login</NavbarButton>
                </Link>
              </div>
            )}
          </NavBody>
          {/* Shopping Cart */}

          {/* Mobile */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  {item.name}
                </a>
              ))}
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>

      {/* Page Content */}
    </>
  );
}
