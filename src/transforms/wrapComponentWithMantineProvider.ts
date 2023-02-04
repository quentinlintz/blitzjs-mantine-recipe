import { Program } from 'blitz/installer'
import j from 'jscodeshift'
import type { NodePath } from 'ast-types/lib/node-path'

export default function wrapComponentWithMantineProvider(program: Program) {
  program
    .find(j.JSXElement)
    .filter(
      path =>
        path.parent?.parent?.parent?.value?.id?.name === 'App' &&
        path.parent?.value.type === j.ReturnStatement.toString()
    )
    .forEach((path: NodePath) => {
      const { node } = path
      path.replace(
        j.jsxElement(
          j.jsxOpeningElement(j.jsxIdentifier(`MantineProvider`), [
            j.jsxAttribute(j.jsxIdentifier('withGlobalStyles')),
            j.jsxAttribute(j.jsxIdentifier('withNormalizeCSS')),
            j.jsxAttribute(
              j.jsxIdentifier('theme'),
              j.jsxExpressionContainer(j.identifier("{ colorScheme: 'light' }"))
            )
          ]),
          j.jsxClosingElement(j.jsxIdentifier('MantineProvider')),
          [j.jsxText('\n'), node, j.jsxText('\n')]
        )
      )
    })

  return program
}
