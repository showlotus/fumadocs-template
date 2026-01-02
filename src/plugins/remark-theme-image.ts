import path from 'path'
import { visit } from 'unist-util-visit'
import { valueToEstree } from 'estree-util-value-to-estree'

let index = 0

function generateImport(varName: string, importPath: string) {
  return {
    type: 'mdxjsEsm',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            source: valueToEstree(importPath),
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: { type: 'Identifier', name: varName },
              },
            ],
          },
        ],
      },
    },
  }
}

function generateSrcAttribute(name: string, varName: string) {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: `${varName}.src`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: varName },
                property: { type: 'Identifier', name: 'src' },
                computed: false,
              },
            },
          ],
        },
      },
    },
  }
}

export function remarkThemeImage() {
  return (tree: any, file: any) => {
    const dir = path.dirname(file.path)

    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== 'ThemeImage') return

      const attrs = ['light', 'dark'] as const
      attrs.forEach(attrName => {
        const attr = node.attributes.find(
          (a: any) => a.type === 'mdxJsxAttribute' && a.name === attrName,
        )
        if (!attr || typeof attr.value !== 'string') return

        const absolutePath = path.resolve(dir, attr.value)
        const importPath = './' + path.relative(dir, absolutePath).replace(/\\/g, '/')
        const varName = `ThemeImage_${attrName}_${index++}`

        // 插入 import 语句
        tree.children.unshift(generateImport(varName, importPath))

        // 替换属性为 {varName.src}
        node.attributes = node.attributes.map((a: any) =>
          a === attr ? generateSrcAttribute(attrName, varName) : a,
        )
      })
    })
  }
}
