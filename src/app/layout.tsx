'use client'

import { RootProvider } from 'fumadocs-ui/provider/next'
import { Inter } from 'next/font/google'
import { useParams } from 'next/navigation'
import SearchDialog from '@/components/search'
import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'
import './global.css'
import { getSection } from '@/lib/source'

const inter = Inter({
  subsets: ['latin'],
})

export function Body({ children }: { children: ReactNode }): React.ReactElement {
  const mode = useMode()

  return <body className={cn(mode, 'relative flex min-h-screen flex-col')}>{children}</body>
}

export function useMode(): string | undefined {
  const { slug = [] } = useParams()
  if (Array.isArray(slug)) return getSection(slug[0])
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <Body>
        <RootProvider
          search={{
            SearchDialog,
          }}
        >
          {children}
        </RootProvider>
      </Body>
    </html>
  )
}
