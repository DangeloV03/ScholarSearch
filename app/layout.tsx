import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PageTransition from '@/components/ui/PageTransition'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ScholarSearch - AI-Powered Scholarship Discovery',
  description: 'Find scholarships and educational opportunities with AI-powered search. Get personalized recommendations for scholarships, grants, and educational programs.',
  keywords: 'scholarships, education, AI, search, grants, financial aid, college, university',
  authors: [{ name: 'ScholarSearch Team' }],
  creator: 'ScholarSearch',
  publisher: 'ScholarSearch',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://scholarsearch.com'),
  openGraph: {
    title: 'ScholarSearch - AI-Powered Scholarship Discovery',
    description: 'Find scholarships and educational opportunities with AI-powered search.',
    url: 'https://scholarsearch.com',
    siteName: 'ScholarSearch',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ScholarSearch - AI-Powered Scholarship Discovery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScholarSearch - AI-Powered Scholarship Discovery',
    description: 'Find scholarships and educational opportunities with AI-powered search.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </body>
    </html>
  )
} 