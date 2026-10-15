import Image from 'next/image'
import type { ReactNode } from 'react'
import { Logo } from '@/components/site/logo'
import { DemoBanner } from '@/components/site/demo-banner'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow: string
  title: string
  description: string
  image: string
  tone?: 'customer' | 'staff'
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ eyebrow, title, description, image, tone = 'customer', children, footer }: Props) {
  return (
    <>
      <DemoBanner />
      <main className="grid min-h-[calc(100dvh-2.25rem)] lg:grid-cols-2">
        <div
          className={cn(
            'relative hidden overflow-hidden lg:block',
            tone === 'staff' ? 'bg-foreground' : 'bg-secondary',
          )}
        >
          <Image src={image} alt="" fill sizes="50vw" className={cn('object-cover', tone === 'staff' && 'opacity-40')} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <p className="absolute right-10 bottom-10 left-10 text-3xl leading-tight font-extrabold text-balance text-white">
            {tone === 'staff' ? 'Run the kitchen. We bring the customers.' : 'Good food, close to home.'}
          </p>
        </div>
        <div className="flex flex-col px-5 py-8 sm:px-10">
          <Logo />
          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 py-10">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold tracking-wider text-primary uppercase">{eyebrow}</p>
              <h1 className="text-3xl font-extrabold">{title}</h1>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
            {children}
            {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </main>
    </>
  )
}
