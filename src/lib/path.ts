import path from 'node:path'
import { init, parse } from 'es-module-lexer'

export async function rewriteImportsInCode(code: string, importerFile: string, targetFile: string) {
  await init

  const [imports] = parse(code)

  let result = ''
  let lastIndex = 0

  for (const imp of imports) {
    const raw = code.slice(imp.s, imp.e)
    const formatted = formatImportPath(importerFile, raw, targetFile)

    result += code.slice(lastIndex, imp.s)
    result += formatted
    lastIndex = imp.e
  }

  result += code.slice(lastIndex)

  return result
}

function formatImportPath(importerFile: string, importSource: string, targetFile: string) {
  // 非相对路径直接返回
  if (!importSource.startsWith('.')) return importSource

  const importerDir = path.dirname(importerFile)
  const targetDir = path.dirname(targetFile)

  // 依赖的真实绝对路径
  const absDependencyPath = path.resolve(importerDir, importSource)

  // 站在 targetFile 角度重新算相对路径
  let next = path.relative(targetDir, absDependencyPath)

  if (!next.startsWith('.')) {
    next = './' + next
  }

  return next.replace(/\\/g, '/')
}

const root = process.cwd()

const importer = path.resolve(root, 'content/docs/components.mdx')
const target = path.resolve(root, '.dev/view-code-cache/temps/component.tsx')

const code = `
import ToggleTheme from './components/toggle-theme.tsx'
import ToggleTheme from './components/toggle-theme'


export function Foo() {}`

const result = await rewriteImportsInCode(code, importer, target)
console.log(result)
