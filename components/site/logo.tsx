import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, tone = 'default' }: { className?: string; tone?: 'default' | 'inverse' }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 rounded-lg', className)} aria-label="Zuppio home">
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-xl bg-primary font-display text-xl font-extrabold text-primary-foreground shadow-sm"
      >
        Z
      </span>
      <span
        className={cn(
          'font-display text-2xl font-extrabold tracking-tight',
          tone === 'inverse' ? 'text-primary-foreground' : 'text-foreground',
        )}
      >
        zuppio
      </span>
    </Link>
  )
}
