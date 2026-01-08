import path from 'node:path'
import fs from 'node:fs'
import { visit } from 'unist-util-visit'
import { displayName } from '@/components/view-code'
import { generateImport, generateJsxAttribute, generateExpressionAttribute } from '@/lib/ast'
import { rewriteImportSource } from '@/lib/path'

export function remarkViewCode(options?: { root?: string }) {
  const { root = process.cwd() } = options ?? {}
  return (tree: any, file: any) => {
    let componentIdx = 0
    const imports: any[] = []
    const dir = path.dirname(file.path)
    const tasks: any[] = []

    const ROOT_CACHE_DIR = '.dev/view-code-cache'

    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== displayName) return

      const srcAttr = node.attributes.find(
        (a: any) => a.type === 'mdxJsxAttribute' && a.name === 'src',
      )
      if (!srcAttr || typeof srcAttr.value !== 'string') return

      const absolutePath = path.resolve(dir, srcAttr.value)
      const importPath = './' + path.relative(dir, absolutePath)
      const varName = `${displayName}Component_${componentIdx++}`

      // 记录 import 语句
      imports.push({ varName, importPath })

      // 删除 src 属性，防止重复调用
      node.attributes = node.attributes.filter((a: any) => a !== srcAttr)

      // 注入组件引用
      node.attributes.push(generateJsxAttribute('component', varName))

      // 注入组件源码
      const CACHE_DIR = `${ROOT_CACHE_DIR}/virtual`
      const cacheDir = path.resolve(root, CACHE_DIR)
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      const cacheFileName = path.basename(absolutePath).replace(/\.[^/.]+$/, '') + '.tsx.virtual'
      const cacheFilePath = path.resolve(cacheDir, cacheFileName)
      const relativeCacheDirPath = path.relative(dir, cacheDir)
      if (fs.existsSync(cacheFilePath)) {
        fs.rmSync(cacheFilePath)
      }
      fs.linkSync(absolutePath, cacheFilePath)
      const sourceCodePath = path.join(relativeCacheDirPath, cacheFileName)
      const sourceCodeName = `${displayName}ComponentSourceCode_${componentIdx++}`
      imports.push({ varName: sourceCodeName, importPath: sourceCodePath })
      node.attributes.push(generateExpressionAttribute('code', sourceCodeName))
    })

    visit(tree, 'code', (node, index, parent) => {
      if (!node.meta) return
      if (!node.meta.includes('view-code')) return

      const varName = `ViewCodeTempComponent_${componentIdx++}`
      tasks.push({ varName, node, index, parent })
    })

    for (const task of tasks) {
      const { varName, node, index, parent } = task

      parent!.children[index!] = {
        type: 'mdxJsxFlowElement',
        name: 'ViewCode',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'code',
            value: node.value,
          },
          generateJsxAttribute('component', varName),
        ],
      }

      // 创建文件夹
      const CACHE_DIR = `${ROOT_CACHE_DIR}/temps`
      const cacheDir = path.resolve(root, CACHE_DIR)
      const fileName = `${varName}.tsx`
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }

      // 将 code 中的 import 路径转换为相对 cache 目录的路径
      const code = rewriteImportSource(
        node.value,
        file.path,
        path.resolve(root, CACHE_DIR, fileName),
      )

      // 创建组件文件
      fs.writeFileSync(path.resolve(cacheDir, fileName), code)
      const relativeCacheDirPath = path.relative(dir, cacheDir)
      const sourceCodePath = path.join(relativeCacheDirPath, fileName)
      imports.push({ varName, importPath: sourceCodePath })
    }

    if (imports.length > 0) {
      tree.children.unshift(
        ...imports.map(({ varName, importPath }) => generateImport(varName, importPath)),
      )
    }
  }
}
