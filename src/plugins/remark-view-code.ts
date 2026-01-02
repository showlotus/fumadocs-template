import path from 'node:path'
import fs from 'node:fs'
import { visit } from 'unist-util-visit'
import { valueToEstree } from 'estree-util-value-to-estree'
import { displayName } from '@/components/view-code'

let index = 0

/**
 * 生成 import
 * @param name 模块名
 * @param value 导入路径
 * @returns
 */
function generateImport(name: string, value: string) {
  return {
    type: 'mdxjsEsm',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            source: valueToEstree(value),
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {
                  type: 'Identifier',
                  name: name,
                },
              },
            ],
          },
        ],
      },
    },
  }
}

/**
 * 生成字符串类型
 * @param name 属性名
 * @param value 属性值
 * @returns
 */
function generateStringAttribute(name: string, value: string) {
  return {
    type: 'mdxJsxAttribute',
    name: name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: value,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: value,
              },
            },
          ],
        },
      },
    },
  }
}

/**
 *
 * @param name 属性名
 * @param componentName 组件名
 * @returns
 */
function generateJsxAttribute(name: string, componentName: string) {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: `<${componentName} />`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'JSXElement',
                openingElement: {
                  type: 'JSXOpeningElement',
                  name: {
                    type: 'JSXIdentifier',
                    name: componentName,
                  },
                  attributes: [],
                  selfClosing: true,
                },
                closingElement: null,
                children: [],
              },
            },
          ],
        },
      },
    },
  }
}

export function remarkViewCode() {
  return (tree: any, file: any) => {
    const dir = path.dirname(file.path)
    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== displayName) return

      const srcAttr = node.attributes.find(
        (a: any) => a.type === 'mdxJsxAttribute' && a.name === 'src',
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
      const code = fs.readFileSync(absolutePath, { encoding: 'utf-8' })
      node.attributes.push(generateStringAttribute('code', JSON.stringify(code)))
    })
  }
}
