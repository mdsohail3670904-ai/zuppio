import Link from 'next/link'
import { ArrowRight, ShieldCheck, Store } from 'lucide-react'

const cards = [
  {
    href: '/merchant/login',
    icon: Store,
    title: 'Own a restaurant?',
    body: 'List your kitchen on Zuppio, manage your menu and accept orders from customers within 5 km.',
    cta: 'Merchant login',
    className: 'bg-foreground text-background',
  },
  {
    href: '/admin/login',
    icon: ShieldCheck,
    title: 'Zuppio operations',
    body: 'Approve merchants, oversee orders and manage the platform across cities.',
    cta: 'Admin login',
    className: 'bg-card text-card-foreground border',
  },
]

export function PartnerSection() {
  return (
    <section aria-labelledby="partners-title" className="mx-auto max-w-7xl px-4 pt-14">
      <h2 id="partners-title" className="sr-only">
        Partner and admin access
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map(({ href, icon: Icon, title, body, cta, className }) => (
          <Link
            key={href}
            href={href}
            className={`group flex flex-col gap-4 rounded-3xl p-6 transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-8 ${className}`}
          >
            <Icon className="size-8 text-primary" aria-hidden="true" />
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="max-w-md text-sm leading-relaxed opacity-80">{body}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
