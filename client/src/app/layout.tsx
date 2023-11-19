import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/store/Provider'
import { ReduxFetch } from '@/components/ReduxFetch'
import { Suspense } from 'react'
import Loading from './Loading'
import 'react-notifications/lib/notifications.css';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Tower Connect',
  description: 'Society Tower connecting app',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextTopLoader />
      <Providers> {/*For redux toolkit*/}
        <Suspense fallback={<Loading/>}> {/* To show loading template*/}
        <ReduxFetch>  {/*For load pre required data*/}
          {children}       
        </ReduxFetch>  
        </Suspense>
      </Providers>
      
      
        
       
      </body>
    </html>
  )
}