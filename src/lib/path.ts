import path from 'node:path'
import ts from 'typescript'

export function rewriteImportSource(
  code: string,
  importerFile: string,
  targetFile: string,
): string {
  const sourceFile = ts.createSourceFile(
    importerFile,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

  // @ts-ignore
  const transformer: ts.TransformerFactory<ts.SourceFile> = ctx => {
    const visit: ts.Visitor = node => {
      // import ... from 'x'
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const oldSource = node.moduleSpecifier.text
        const newSource = formatImportPath(importerFile, oldSource, targetFile)

        if (newSource !== oldSource) {
          return ts.factory.updateImportDeclaration(
            node,
            node.modifiers,
            node.importClause,
            ts.factory.createStringLiteral(newSource),
            node.assertClause,
          )
        }
      }

      return ts.visitEachChild(node, visit, ctx)
    }

    return node => ts.visitNode(node, visit)
  }

  const result = ts.transform(sourceFile, [transformer])
  return ts.createPrinter().printFile(result.transformed[0])
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
