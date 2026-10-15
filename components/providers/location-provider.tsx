'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEMO_CITIES } from '@/lib/demo/data'
import type { City } from '@/lib/types'

type LocationContextValue = {
  city: City
  cities: City[]
  setCityId: (id: string) => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

// TODO(location): replace city picker with navigator.geolocation /
// @capacitor/geolocation and a saved-addresses list per user.
export function LocationProvider({ children }: { children: ReactNode }) {
  const [cityId, setCityId] = useState(DEMO_CITIES[0].id)

  const value = useMemo(
    () => ({
      city: DEMO_CITIES.find((c) => c.id === cityId) ?? DEMO_CITIES[0],
      cities: DEMO_CITIES,
      setCityId,
    }),
    [cityId],
  )

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocation must be used within LocationProvider')
  return ctx
}
