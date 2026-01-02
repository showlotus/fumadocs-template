'use client'

import { CodeBlock } from 'fumadocs-ui/components/codeblock'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { codeToHtml } from 'shiki'

function CustomCodeBlock(props: { lang: string; code: string }) {
  const { lang, code } = props
  const [out, setOut] = useState('')
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light'

  useEffect(() => {
    if (!code) return
    codeToHtml(code, {
      lang,
      theme,
    }).then(res => setOut(res))
  }, [lang, code, theme])

  return <div className="custom-code-block" dangerouslySetInnerHTML={{ __html: out }} />
}

export function ViewCode(props: {
  src?: string
  code: string
  component?: React.FunctionComponent<void>
}) {
  const { code, component } = props
  return (
    <div className="viewcode-container">
      <Tabs items={['View', 'Code']} defaultIndex={0}>
        <Tab value="View">
          <>{component}</>
        </Tab>
        <Tab value="Code">
          <CodeBlock keepBackground={false}>
            <CustomCodeBlock lang="tsx" code={code} />
          </CodeBlock>
        </Tab>
      </Tabs>
    </div>
  )
}

export const displayName = (ViewCode.dispalyName = 'ViewCode')
