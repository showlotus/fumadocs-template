import path from 'path'
import { visit } from 'unist-util-visit'
import { attrMember, generateImport } from '@/lib/ast'

export function remarkThemeImage() {
  return (tree: any, file: any) => {
    let componentIdx = 0
    const imports: any[] = []
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
        const varName = `ThemeImage_${attrName}_${componentIdx++}`

        // 记录 import 语句
        imports.push({ varName, importPath })

        // 替换属性为 {varName.src}
        node.attributes = node.attributes.map((a: any) =>
          a === attr ? attrMember(attrName, varName, 'src') : a
        )
      })
    })

    if (imports.length > 0) {
      tree.children.unshift(
        ...imports.map(({ varName, importPath }) =>
          generateImport(varName, importPath)
        )
      )
    }
  }
}
