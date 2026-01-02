'use client'

import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { cn } from '@/lib/cn'

export function Button(props: {
  icon?: React.ReactNode
  children?: React.ReactNode
  onClick?: () => void
}) {
  const { icon, children, onClick } = props
  return (
    <button
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'sm',
          className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
        }),
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  )
}
