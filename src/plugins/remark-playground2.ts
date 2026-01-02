import path from 'path'
import fs from 'fs'
import { visit } from 'unist-util-visit'
import recast from 'recast'
import { types as t } from 'recast'

let index = 0

/**
 * 生成 import 语句
 */
function generateImport(varName: string, importPath: string) {
  const ast = t.builders.program([
    t.builders.importDeclaration(
      [t.builders.importDefaultSpecifier(t.builders.identifier(varName))],
      t.builders.literal(importPath),
    ),
  ])
  return {
    type: 'mdxjsEsm',
    data: { estree: ast },
  }
}

/**
 * 生成 component={<Comp />} 属性
 */
function generateComponentAttribute(componentName: string) {
  const jsxNode = t.builders.jsxElement(
    t.builders.jsxOpeningElement(t.builders.jsxIdentifier(componentName), [], true),
    null,
    [],
  )
  return {
    type: 'mdxJsxAttribute',
    name: 'component',
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: `<${componentName} />`,
      data: {
        estree: t.builders.program([t.builders.expressionStatement(jsxNode)]),
      },
    },
  }
}

/**
 * 生成 code={"..."} 属性
 */
function generateCodeAttribute(code: string) {
  return {
    type: 'mdxJsxAttribute',
    name: 'code',
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: JSON.stringify(code),
      data: {
        estree: t.builders.program([
          t.builders.expressionStatement(t.builders.stringLiteral(code)),
        ]),
      },
    },
  }
}

/**
 * remark 插件
 */
export function remarkPlayground2() {
  return (tree: any, file: any) => {
    const dir = path.dirname(file.path)

    visit(tree, 'mdxJsxFlowElement', node => {
      if (node.name !== 'Playground') return

      const srcAttr = node.attributes.find(
        (a: any) => a.type === 'mdxJsxAttribute' && a.name === 'src',
      )
      if (!srcAttr || typeof srcAttr.value !== 'string') return

      // 绝对路径 + 相对路径处理
      const absolutePath = path.resolve(dir, srcAttr.value)
      const importPath = './' + path.relative(dir, absolutePath).replace(/\\/g, '/')

      const componentName = `PlaygroundComponent_${index++}`

      // 1️⃣ 注入 import
      tree.children.unshift(generateImport(componentName, importPath))

      // 2️⃣ 删除 src 属性
      node.attributes = node.attributes.filter((a: any) => a !== srcAttr)

      // 3️⃣ 注入 component={<Comp />}
      node.attributes.push(generateComponentAttribute(componentName))

      // 4️⃣ 注入源码 code
      const code = fs.readFileSync(absolutePath, 'utf-8')
      node.attributes.push(generateCodeAttribute(code))
    })
  }
}
