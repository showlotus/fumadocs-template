import { ImageZoom } from 'fumadocs-ui/components/image-zoom'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

import { Button } from './components/button'
import { LinkButton } from './components/link-button'
import { GithubButton } from './components/github-button'
import { ThemeImage } from './components/theme-image'
import { ViewCode } from './components/view-code'
import { CodeBlock } from './components/code-block'

// TAG register some global components and use them in mdx
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // img: props => <ImageZoom {...(props as any)} />,
    ...components,
    Button,
    LinkButton,
    GithubButton,
    ThemeImage,
    ViewCode,
    CodeBlock,
  }
}
