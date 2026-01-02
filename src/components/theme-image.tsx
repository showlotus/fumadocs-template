'use client'

import { cn } from '@/lib/cn'
import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeImage({
  light,
  dark,
  className,
}: {
  light: string
  dark: string
  className?: string
}) {
  const { theme } = useTheme()
  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    if (theme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImgSrc(theme === 'dark' ? dark : light)
    }
  }, [theme, light, dark])
  return (
    imgSrc && (
      <ImageZoom
        src={imgSrc}
        className={cn('w-full h-auto border rounded-lg', className)}
        width={100}
        height={100}
        loading="lazy"
        alt={imgSrc}
      />
    )
  )
}
