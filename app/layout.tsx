import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import { CartProvider } from '@/components/providers/cart-provider'
import { LocationProvider } from '@/components/providers/location-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })

export const metadata: Metadata = {
  title: {
    default: 'Zuppio — Food delivery from restaurants near you',
    template: '%s · Zuppio',
  },
  description:
    'Zuppio is an India-wide food delivery platform connecting you with restaurants within 5 km. Biryani, dosa, thali, street food and more.',
  generator: 'v0.app',
  applicationName: 'Zuppio',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#d9481f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${bricolage.variable}`}>
      <body className="antialiased">
        <LocationProvider>
          <CartProvider>{children}</CartProvider>
        </LocationProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
