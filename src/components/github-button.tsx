'use client'

import { Github } from 'lucide-react'
import { LinkButton } from './link-button'

export function GithubButton(props: { url?: string }) {
  const { url } = props
  return <LinkButton url={url} icon={<Github />} text="Github" />
}
