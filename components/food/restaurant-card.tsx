import Image from 'next/image'
import Link from 'next/link'
import { Clock, Leaf, MapPin } from 'lucide-react'
import { formatDistance, formatINR } from '@/lib/format'
import type { RestaurantWithDistance } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DemoTag, RatingBadge } from './food-badges'

export function RestaurantCard({ restaurant }: { restaurant: RestaurantWithDistance }) {
  const r = restaurant
  return (
    <Link
      href={`/restaurants/${r.id}`}
      className="group flex flex-col gap-3 rounded-2xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={r.image || '/placeholder.svg'}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            'object-cover transition-transform duration-500 group-hover:scale-105',
            !r.isOpen && 'grayscale',
          )}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
        <DemoTag className="absolute top-3 left-3" />
        {r.isPureVeg && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-veg">
            <Leaf className="size-3" aria-hidden="true" />
            Pure veg
          </span>
        )}
        {r.offer && r.isOpen && (
          <p className="absolute bottom-3 left-3 font-display text-lg leading-tight font-extrabold text-white">
            {r.offer}
          </p>
        )}
        {!r.isOpen && (
          <p className="absolute bottom-3 left-3 rounded-md bg-card px-2 py-1 text-xs font-semibold">
            Currently closed
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-sans text-base leading-snug font-bold group-hover:text-primary">{r.name}</h3>
          <RatingBadge rating={r.rating} className="mt-0.5" />
        </div>
        <p className="truncate text-sm text-muted-foreground">{r.cuisines.join(', ')}</p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {r.deliveryTimeMins} min
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {formatDistance(r.distanceKm)}
          </span>
          <span>{formatINR(r.costForTwo)} for two</span>
        </p>
      </div>
    </Link>
  )
}
