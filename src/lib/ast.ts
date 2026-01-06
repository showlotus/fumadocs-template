import * as t from '@babel/types'

function programWithExpression(expr: t.Expression) {
  return t.program([t.expressionStatement(expr)], [], 'module')
}

function mdxExpressionAttribute(
  name: string,
  value: string,
  expression: t.Expression
) {
  return {
    type: 'mdxJsxAttribute',
    name,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value,
      data: {
        estree: programWithExpression(expression),
      },
    },
  }
}

/**
 * 生成 import 语句
 * import name from 'value'
 */
export function generateImport(name: string, value: string) {
  return {
    type: 'mdxjsEsm',
    data: {
      estree: t.program(
        [
          t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(name))],
            t.stringLiteral(value)
          ),
        ],
        [],
        'module'
      ),
    },
  }
}

/**
 * 生成字符串（变量）类型属性
 * foo={bar}
 */
export function generateStringAttribute(name: string, value: string) {
  return mdxExpressionAttribute(name, value, t.identifier(value))
}

/**
 * 生成表达式类型属性
 * foo={expr}
 */
export function generateExpressionAttribute(name: string, value: string) {
  return mdxExpressionAttribute(name, value, t.identifier(value))
}

/**
 * 生成 JSX 组件属性
 * foo={<Component />}
 */
export function generateJsxAttribute(name: string, componentName: string) {
  const jsxElement = t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier(componentName), [], true),
    null,
    [],
    true
  )

  return mdxExpressionAttribute(name, `<${componentName} />`, jsxElement)
}

/**
 * 生成属性成员表达式
 * foo={bar.baz}
 */
export function attrMember(name: string, object: string, property: string) {
  return mdxExpressionAttribute(
    name,
    `${object}.${property}`,
    t.memberExpression(t.identifier(object), t.identifier(property))
  )
}
