import Image from 'next/image'
import type { ReactNode } from 'react'
import { BadgeIndianRupee, Leaf, MapPinned } from 'lucide-react'

const highlights = [
  { icon: MapPinned, label: 'Restaurants within 5 km' },
  { icon: Leaf, label: 'Clear veg & non-veg labels' },
  { icon: BadgeIndianRupee, label: 'UPI & cards via Razorpay (coming soon)' },
]

export function Hero({ cityName, search }: { cityName: string; search: ReactNode }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-secondary">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-8 pb-10 md:grid-cols-[1.1fr_1fr] md:py-14 lg:gap-12">
        <div className="flex flex-col gap-5">
          <p className="w-fit rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary shadow-xs">
            Now previewing in {cityName}
          </p>
          <h1
            id="hero-title"
            className="text-4xl leading-[1.05] font-extrabold tracking-tight text-secondary-foreground sm:text-5xl lg:text-6xl"
          >
            Hungry? <span className="text-primary">Zuppio</span> it.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Biryani, dosa, thali and street-side chaat from kitchens close to you — anywhere in India.
          </p>
          <div id="search" className="scroll-mt-24">
            {search}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary-foreground sm:text-sm">
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto aspect-[4/3] w-full max-w-md md:max-w-none">
          <Image
            src="/images/hero.png"
            alt="An Indian feast with biryani, curries and naan served in brass bowls"
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="rounded-3xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  )
}
