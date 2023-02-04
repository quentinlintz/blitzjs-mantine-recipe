import { addImport, paths, RecipeBuilder } from 'blitz/installer'
import j from 'jscodeshift'
import wrapComponentWithMantineProvider from './transforms/wrapComponentWithMantineProvider'

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
      { name: '@emotion/react', version: 'latest' }
    ]
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
