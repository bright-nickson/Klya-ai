import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'KLYA AI - Empowering Ghanaian Businesses',
  description: 'AI platform empowering businesses and creators through intelligent tools',
  keywords: ['AI', 'SaaS', 'Business Tools', 'Content Creation', 'Productivity', 'Automation'],
  authors: [{ name: 'KLYA AI Team' }],
  openGraph: {
    title: 'KLYA AI - Intelligent Tools for Creators and Businesses',
    description: 'Empowering businesses and creators with AI-powered tools',
    type: 'website',
    locale: 'en_GH',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
