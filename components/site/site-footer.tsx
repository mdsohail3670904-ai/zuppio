import Link from 'next/link'
import { Logo } from './logo'

const groups = [
  {
    title: 'For customers',
    links: [
      { href: '/login', label: 'Sign in' },
      { href: '/register', label: 'Create account' },
      { href: '/cart', label: 'Your cart' },
    ],
  },
  {
    title: 'For partners',
    links: [
      { href: '/merchant/login', label: 'Merchant login' },
      { href: '/admin/login', label: 'Admin login' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-card pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Food from restaurants within 5 km of you, across India. This site is a demo preview — no real orders are
            accepted yet.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="font-sans text-sm font-semibold">{group.title}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        {'© '}
        {new Date().getFullYear()} Zuppio · Demo preview
      </p>
    </footer>
  )
}
