import { FlaskConical } from 'lucide-react'
import { DEMO_MODE } from '@/lib/config'

export function DemoBanner() {
  if (!DEMO_MODE) return null
  return (
    <div className="bg-foreground text-background">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs leading-relaxed sm:text-sm">
        <FlaskConical className="size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Demo preview.</strong> Restaurants and menus are sample data. Login,
          ordering and payments are not live yet.
        </span>
      </p>
    </div>
  )
}
