import type { ReactNode } from 'react'
import { DemoBanner } from './demo-banner'
import { MobileNav } from './mobile-nav'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      <SiteHeader />
      <main className="min-h-[60vh]">{children}</main>
      <SiteFooter />
      <MobileNav />
    </>
  )
}
