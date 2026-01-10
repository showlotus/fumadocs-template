import path from 'node:path'
import fs from 'node:fs'
import { visit } from 'unist-util-visit'
import { displayName } from '@/components/view-code'
import { generateImport, generateJsxAttribute, generateExpressionAttribute } from '@/lib/ast'
import { rewriteImportSource } from '@/lib/path'

export function remarkViewCode(options?: { root?: string }) {
  const { root = process.cwd() } = options ?? {}

  const tempFileNameIndexMap = new Map<string, number>()
  const virtualFileNameIndexMap = new Map<string, number>()

  // 创建缓存目录
  const ROOT_CACHE_DIR = '.dev/view-code-cache'
  const TEMP_CACHE_DIR = `${ROOT_CACHE_DIR}/temp`
  const VIRTUAL_CACHE_DIR = `${ROOT_CACHE_DIR}/virtual`
  ;[TEMP_CACHE_DIR, VIRTUAL_CACHE_DIR].forEach((dir: string) => {
    const cacheDir = path.resolve(root, dir)
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true })
    }
  })

  return (tree: any, file: any) => {
    const imports: any[] = []
    const dir = path.dirname(file.path)
    const tasks: any[] = []

    let virtualIdx = 0
    let tempIdx = 0

    let componentVarNameIdx = 0

    // 初始化文件索引
    if (!tempFileNameIndexMap.has(file.path)) {
      tempFileNameIndexMap.set(file.path, tempFileNameIndexMap.size + 1)
    }
    if (!virtualFileNameIndexMap.has(file.path)) {
      virtualFileNameIndexMap.set(file.path, virtualFileNameIndexMap.size + 1)
    }

    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== displayName) return

      const srcAttr = node.attributes.find(
        (a: any) => a.type === 'mdxJsxAttribute' && a.name === 'src',
      )
      if (!srcAttr || typeof srcAttr.value !== 'string') return

      const absolutePath = path.resolve(dir, srcAttr.value)
      const importPath = './' + path.relative(dir, absolutePath)
      const varName = `${displayName}ActualComponent${componentVarNameIdx++}`

      // 记录 import 语句
      imports.push({ varName, importPath })

      // 删除 src 属性，防止重复调用
      node.attributes = node.attributes.filter((a: any) => a !== srcAttr)

      // 注入组件引用
      node.attributes.push(generateJsxAttribute('component', varName))

      // 注入组件源码
      const cacheDir = path.resolve(root, VIRTUAL_CACHE_DIR)
      const cacheFileName = `${displayName}VirtualComponent_${virtualFileNameIndexMap.get(
        file.path,
      )}_${virtualIdx++}.tsx.virtual`
      const cacheFilePath = path.resolve(cacheDir, cacheFileName)
      const relativeCacheDirPath = path.relative(dir, cacheDir)
      if (fs.existsSync(cacheFilePath)) {
        fs.unlinkSync(cacheFilePath)
      }
      fs.linkSync(absolutePath, cacheFilePath)
      const sourceCodePath = path.join(relativeCacheDirPath, cacheFileName)
      const sourceCodeVarName = `${displayName}ComponentSourceCode${componentVarNameIdx++}`
      imports.push({ varName: sourceCodeVarName, importPath: sourceCodePath })
      node.attributes.push(generateExpressionAttribute('code', sourceCodeVarName))
    })

    visit(tree, 'code', (node, index, parent) => {
      if (!node.meta) return
      if (!node.meta.includes('view-code')) return

      const varName = `${displayName}TempComponent${componentVarNameIdx++}`
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

      // 生成文件路径
      const cacheDir = path.resolve(root, TEMP_CACHE_DIR)
      const fileName = `${displayName}TempComponent_${tempFileNameIndexMap.get(
        file.path,
      )}_${tempIdx++}.tsx`
      const filePath = path.resolve(cacheDir, fileName)

      // 将 code 中的 import 路径转换为相对 cache 目录的路径
      const code = rewriteImportSource(node.value, file.path, filePath)

      // 创建组件文件
      fs.writeFileSync(filePath, code)
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
