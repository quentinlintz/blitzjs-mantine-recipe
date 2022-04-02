import { addImport, paths, Program, RecipeBuilder } from '@blitzjs/installer'
import type { NodePath } from 'ast-types/lib/node-path'
import j from 'jscodeshift'

function createGetInitialProps(program: Program) {
  program.find(j.ExportDefaultDeclaration).forEach(path => {
    path.insertBefore(
      j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier('getInitialProps'),
          j.callExpression(j.identifier('createGetInitialProps'), [])
        )
      ])
    )
  })

  program
    .find(j.JSXElement)
    .filter(
      path =>
        path.parent?.parent?.parent?.value?.id?.name === 'MyDocument' &&
        path.parent?.value.type === j.ReturnStatement.toString()
    )
    .forEach(path => {
      path.insertAfter('static getInitialProps = getInitialProps;')
    })

  return program
}

function wrapComponentWithMantineProvider(program: Program) {
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

export default RecipeBuilder()
  .setName('Mantine')
  .setDescription(
    'This will install all necessary dependencies and configure Mantine for use.'
  )
  .setOwner('Quentin Lintz <quentinlintz@outlook.com>')
  .setRepoLink('https://github.com/quentinlintz/blitzjs-mantine-recipe')
  .addAddDependenciesStep({
    stepId: 'addDeps',
    stepName: 'Add npm dependencies',
    explanation: `Mantine has many packages, but core and hooks are the basics`,
    packages: [
      { name: '@mantine/core', version: 'latest' },
      { name: '@mantine/hooks', version: 'latest' },
      { name: '@mantine/next', version: 'latest' }
    ]
  })
  .addTransformFilesStep({
    stepId: 'importMantineProvider',
    stepName: 'Import MantineProvider component',
    explanation: `Import the Mantine provider into _app, so it is accessible in the whole app`,
    singleFileSearch: paths.document(),
    transform(program) {
      const stylesImport = j.importDeclaration(
        [j.importSpecifier(j.identifier('createGetInitialProps'))],
        j.literal('@mantine/next')
      )

      addImport(program, stylesImport)

      return createGetInitialProps(program)
    }
  })
  .addTransformFilesStep({
    stepId: 'importMantineProvider',
    stepName: 'Import MantineProvider component',
    explanation: `Import the Mantine provider into _app, so it is accessible in the whole app`,
    singleFileSearch: paths.app(),
    transform(program) {
      const stylesImport = j.importDeclaration(
        [j.importSpecifier(j.identifier('MantineProvider'))],
        j.literal('@mantine/core')
      )

      addImport(program, stylesImport)

      return wrapComponentWithMantineProvider(program)
    }
  })
  .build()
