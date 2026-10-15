'use client'

import { ChevronDown, MapPin } from 'lucide-react'
import { useLocation } from '@/components/providers/location-provider'

export function LocationPicker() {
  const { city, cities, setCityId } = useLocation()
  return (
    <label className="relative flex min-w-0 items-center gap-1.5 rounded-lg py-1 pr-1 text-sm">
      <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
      <span className="sr-only">Delivery city</span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="flex items-center gap-1 truncate font-semibold">
          {city.name}
          <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
        </span>
        <span className="truncate text-xs text-muted-foreground">{city.state} · demo location</span>
      </span>
      <select
        value={city.id}
        onChange={(e) => setCityId(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}, {c.state}
          </option>
        ))}
      </select>
    </label>
  )
}
