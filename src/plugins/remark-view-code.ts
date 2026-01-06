import path from 'node:path'
import fs from 'node:fs'
import { visit } from 'unist-util-visit'
import { displayName } from '@/components/view-code'
import {
  generateImport,
  generateJsxAttribute,
  generateExpressionAttribute,
} from '@/lib/ast'

let index = 0

export function remarkViewCode(options?: { root?: string }) {
  const { root = process.cwd() } = options ?? {}
  return (tree: any, file: any) => {
    const dir = path.dirname(file.path)
    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== displayName) return

      const srcAttr = node.attributes.find(
        (a: any) => a.type === 'mdxJsxAttribute' && a.name === 'src'
      )
      if (!srcAttr || typeof srcAttr.value !== 'string') return

      const absolutePath = path.resolve(dir, srcAttr.value)
      const importPath = './' + path.relative(dir, absolutePath)
      const varName = `${displayName}Component_${index++}`

      // 用 valueToEstree 生成 import
      tree.children.unshift(generateImport(varName, importPath))

      // 删除 src 属性，防止重复调用
      node.attributes = node.attributes.filter((a: any) => a !== srcAttr)

      // 注入组件引用
      node.attributes.push(generateJsxAttribute('component', varName))

      // 注入组件源码
      const CACHE_DIR = '.dev/view-code-cache'
      const cacheDir = path.resolve(root, CACHE_DIR)
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      const cacheFileName =
        path.basename(absolutePath).replace(/\.[^/.]+$/, '') + '.tsx.virtual'
      const cacheFilePath = path.resolve(cacheDir, cacheFileName)
      const relativeCacheDirPath = path.relative(dir, cacheDir)
      if (fs.existsSync(cacheFilePath)) {
        fs.rmSync(cacheFilePath)
      }
      fs.linkSync(absolutePath, cacheFilePath)
      const sourceCodePath = path.join(relativeCacheDirPath, cacheFileName)
      const sourceCodeName = `${displayName}ComponentSourceCode_${index++}`
      tree.children.unshift(generateImport(sourceCodeName, sourceCodePath))
      node.attributes.push(generateExpressionAttribute('code', sourceCodeName))
    })
  }
}
