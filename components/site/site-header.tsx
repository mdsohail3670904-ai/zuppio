'use client'

import Link from 'next/link'
import { ShoppingBag, Store, UserRound } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LocationPicker } from './location-picker'
import { Logo } from './logo'

export function SiteHeader() {
  const { itemCount } = useCart()
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Logo />
        <div className="ml-1 hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <LocationPicker />
        </div>
        <nav aria-label="Primary" className="flex items-center gap-1">
          <Link
            href="/merchant/login"
            className={cn(buttonVariants({ variant: 'ghost' }), 'hidden h-10 px-3 md:inline-flex')}
          >
            <Store aria-hidden="true" />
            Partner with us
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }), 'hidden h-10 px-3 md:inline-flex')}>
            <UserRound aria-hidden="true" />
            Sign in
          </Link>
          <Link
            href="/cart"
            className={cn(buttonVariants({ variant: 'default' }), 'relative h-10 px-3')}
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
          >
            <ShoppingBag aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-primary-foreground px-1 text-xs font-bold text-primary">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
