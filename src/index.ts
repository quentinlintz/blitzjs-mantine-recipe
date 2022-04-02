import { RecipeBuilder } from '@blitzjs/installer'

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
  .build()
