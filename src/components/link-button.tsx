'use client'

import { Link, ExternalLink } from 'lucide-react'
import { Button } from './button'

export function LinkButton(props: {
  url?: string
  icon?: React.ReactNode
  text?: string
  children?: React.ReactNode
}) {
  const { url, icon = <Link />, text, children } = props
  return (
    <Button>
      <a
        href={url}
        target="_blank"
        className="flex no-underline justify-center items-center gap-1.5"
      >
        <ExternalLink />
        {children ? children : text}
      </a>
    </Button>
  )
}
