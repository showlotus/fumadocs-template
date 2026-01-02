import { visit } from 'unist-util-visit'

export default function remarkLiveCode() {
  return (tree: any) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!node.meta) return
      if (!node.meta.includes('live')) return

      const code = node.value

      parent.children[index!] = {
        type: 'mdxJsxFlowElement',
        name: 'Playground',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'code',
            value: code,
          },
        ],
      }
    })
  }
}
