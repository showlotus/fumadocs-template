import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { rewriteImportSource } from '../src/lib/path'

describe('rewriteImportSourceTS', () => {
  it('should rewrite import source', () => {
    const code = /* ts */ `
    import ToggleTheme from './components/toggle-theme.tsx'
    import ToggleTheme from './components/toggle-theme'

    export function Foo(props: { name: string }) {
      return <div>This is a Foo with <ToggleTheme /></div>
    }`

    const root = process.cwd()
    const importer = path.resolve(root, 'content/docs/components.mdx')
    const target = path.resolve(root, '.dev/view-code-cache/temps/component.tsx')
    const res = rewriteImportSource(code, importer, target)
    expect(res.split('\n').slice(0, 2)).toStrictEqual([
      'import ToggleTheme from "../../../content/docs/components/toggle-theme.tsx";',
      'import ToggleTheme from "../../../content/docs/components/toggle-theme";',
    ])
  })
})
