'use client'

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { CodeBlock } from './code-block'

export function ViewCode(props: {
  src?: string
  code: string
  component?: React.FunctionComponent<void>
}) {
  const { code, component } = props
  return (
    <div className="view-code-container">
      <Tabs items={['View', 'Code']} defaultIndex={0}>
        <Tab value="View">
          <>{component}</>
        </Tab>
        <Tab value="Code">
          <CodeBlock lang="tsx" code={code} />
        </Tab>
      </Tabs>
    </div>
  )
}

export const displayName = (ViewCode.dispalyName = 'ViewCode')
