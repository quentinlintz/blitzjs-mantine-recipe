import { RecipeBuilder } from '@blitzjs/installer'

export default RecipeBuilder()
  .setName('Mantine')
  .setDescription(
    'This will install all necessary dependencies and configure Mantine for use.'
  )
  .setOwner('Quentin Lintz <quentinlintz@outlook.com>')
  .setRepoLink('https://github.com/quentinlintz/blitzjs-mantine-recipe')
  .build()
