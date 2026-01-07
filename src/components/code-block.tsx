'use client'

import { CodeBlock as CodeBlockComponent } from 'fumadocs-ui/components/codeblock'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { codeToHtml } from 'shiki'

export function CodeBlock(props: { lang: string; code: string }) {
  const { lang, code } = props
  const [out, setOut] = useState('')
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light'

  useEffect(() => {
    if (!code) return
    codeToHtml(code, {
      lang,
      theme,
    }).then((res) => setOut(res))
  }, [lang, code, theme])

  return (
    <CodeBlockComponent keepBackground={false}>
      <div
        className="custom-code-block"
        dangerouslySetInnerHTML={{ __html: out }}
      />
    </CodeBlockComponent>
  )
}
