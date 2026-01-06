import path from 'path'
import { visit } from 'unist-util-visit'
import { attrMember, generateImport } from '@/lib/ast'

let index = 0

export function remarkThemeImage() {
  return (tree: any, file: any) => {
    const dir = path.dirname(file.path)

    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== 'ThemeImage') return

      const attrs = ['light', 'dark'] as const
      attrs.forEach((attrName) => {
        const attr = node.attributes.find(
          (a: any) => a.type === 'mdxJsxAttribute' && a.name === attrName
        )
        if (!attr || typeof attr.value !== 'string') return

        const absolutePath = path.resolve(dir, attr.value)
        const importPath =
          './' + path.relative(dir, absolutePath).replace(/\\/g, '/')
        const varName = `ThemeImage_${attrName}_${index++}`

        // 插入 import 语句
        tree.children.unshift(generateImport(varName, importPath))

        // 替换属性为 {varName.src}
        node.attributes = node.attributes.map((a: any) =>
          a === attr ? attrMember(attrName, varName, 'src') : a
        )
      })
    })
  }
}
