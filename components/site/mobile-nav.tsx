'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, Search, ShoppingBag, UserRound } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Home', icon: House },
  { href: '/#search', label: 'Search', icon: Search },
  { href: '/cart', label: 'Cart', icon: ShoppingBag },
  { href: '/login', label: 'Account', icon: UserRound },
]

export function MobileNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === pathname
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
                {label === 'Cart' && itemCount > 0 && (
                  <span className="absolute top-1.5 left-1/2 ml-2 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
