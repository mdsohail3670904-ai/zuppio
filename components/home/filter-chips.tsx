'use client'

import { cn } from '@/lib/utils'

export type DiscoveryFilters = {
  vegOnly: boolean
  topRated: boolean
  fastDelivery: boolean
  openNow: boolean
}

const chips: { key: keyof DiscoveryFilters; label: string }[] = [
  { key: 'vegOnly', label: 'Pure veg' },
  { key: 'topRated', label: 'Rating 4.3+' },
  { key: 'fastDelivery', label: 'Under 30 min' },
  { key: 'openNow', label: 'Open now' },
]

type Props = {
  filters: DiscoveryFilters
  onToggle: (key: keyof DiscoveryFilters) => void
}

export function FilterChips({ filters, onToggle }: Props) {
  return (
    <div role="group" aria-label="Filters" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4">
      {chips.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          aria-pressed={filters[key]}
          onClick={() => onToggle(key)}
          className={cn(
            'h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
            filters[key]
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-card text-foreground hover:border-foreground/40',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
