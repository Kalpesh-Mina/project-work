import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'Golf & Give — Play. Win. Give.',
  description: 'Subscribe to play golf, enter monthly prize draws, and support the charity you care about. A modern platform combining performance tracking with charitable giving.',
  keywords: 'golf, charity, prize draw, stableford, subscription, give back',
  openGraph: {
    title: 'Golf & Give — Play. Win. Give.',
    description: 'A modern golf performance platform with monthly prize draws and charity giving.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#e2e8f0',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
