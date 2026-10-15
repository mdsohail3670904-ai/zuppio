'use client'

import Image from 'next/image'
import type { Category } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function CategoryRail({ categories, selectedId, onSelect }: Props) {
  return (
    <section aria-labelledby="categories-title" className="mx-auto max-w-7xl px-4 pt-10">
      <h2 id="categories-title" className="text-xl font-bold sm:text-2xl">
        What&apos;s on your mind?
      </h2>
      <ul className="scrollbar-none -mx-4 mt-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:gap-6">
        {categories.map((category) => {
          const selected = category.id === selectedId
          return (
            <li key={category.id} className="snap-start">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(selected ? null : category.id)}
                className="group flex w-20 flex-col items-center gap-2 rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:w-24"
              >
                <span
                  className={cn(
                    'relative size-20 overflow-hidden rounded-full bg-muted ring-offset-2 ring-offset-background transition-all sm:size-24',
                    selected ? 'ring-3 ring-primary' : 'group-hover:ring-2 group-hover:ring-border',
                  )}
                >
                  <Image src={category.image || '/placeholder.svg'} alt="" fill sizes="96px" className="object-cover" />
                </span>
                <span className={cn('text-center text-xs font-semibold sm:text-sm', selected && 'text-primary')}>
                  {category.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
