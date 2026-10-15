import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function VegIndicator({ isVeg, className }: { isVeg: boolean; className?: string }) {
  return (
    <span
      role="img"
      aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      className={cn(
        'inline-grid size-4 shrink-0 place-items-center rounded-[3px] border-[1.5px] bg-card',
        isVeg ? 'border-veg' : 'border-nonveg',
        className,
      )}
    >
      <span className={cn('size-2 rounded-full', isVeg ? 'bg-veg' : 'bg-nonveg')} />
    </span>
  )
}

export function RatingBadge({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md bg-rating px-1.5 py-0.5 text-xs font-bold text-primary-foreground',
        className,
      )}
    >
      <Star className="size-3 fill-current" aria-hidden="true" />
      {rating.toFixed(1)}
      <span className="sr-only"> out of 5</span>
    </span>
  )
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-foreground/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background uppercase backdrop-blur',
        className,
      )}
    >
      Demo
    </span>
  )
}
