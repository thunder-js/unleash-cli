import path from 'path'
import fs from 'fs-extra'
import { safelyWrite } from '../../common/files';
import { render } from '../../common/template';
import { spinner } from '../../common/ui';
import { getInfoFromGraphQLFile } from '../../common/graphql';
import { getModuleName, getModulesFolder, Folders } from '../../common/folder-structure';
import { capitalizeFirst, camelToKebab } from '../../common/string';
import { appendStory } from '../../common/stories';

const COMPONENT_FILENAME = 'index.tsx'
const STORY_FILENAME = 'stories.tsx'
const CONTAINER_FILENAME = 'index.tsx'

export const createSinglePack = async (queryPath) => {
  try {
    const {
      operation,
      name: queryName,
    } = await getInfoFromGraphQLFile(queryPath)
    if (operation !== 'query') throw new Error('Must provide a graphql QUERY')

    const moduleName = getModuleName(queryPath)
    const modulesBaseFolder = await getModulesFolder(process.cwd())
    const moduleFolder = path.join(modulesBaseFolder, moduleName)
    
    const componentName = capitalizeFirst(queryName)
    const hocFileName = `with-${camelToKebab(queryName)}.ts`
    
    const componentDestFolder = path.join(moduleFolder, Folders.components, componentName)
    if (!fs.existsSync(componentDestFolder)) await fs.mkdir(componentDestFolder)
    const componentDestPath = path.join(componentDestFolder, COMPONENT_FILENAME)
    const storyDestPath = path.join(componentDestFolder, STORY_FILENAME)
    const hocDestPath = path.join(moduleFolder, Folders.hocs, hocFileName)
    const containerDestFolder = path.join(moduleFolder, Folders.containers, componentName)
    if (!fs.existsSync(containerDestFolder)) await fs.mkdir(containerDestFolder)
    const containerDestPath = path.join(containerDestFolder, CONTAINER_FILENAME)
    const storyRequirePath = `./modules/${moduleName}/components/${componentName}/stories`

    const renderedComponent = await render('component-single', {
      componentName,
      dataNamespace: queryName,
    })
  
    const renderedStory = await render('story-single', {
      componentName,
    })
  
    const renderedHoc = await render('hoc-single', {
      queryName,
      entityName: 'Entity',
      graphqlField: '',
      interfaceName: capitalizeFirst(queryName),
    })

    const renderedContainer = await render('container-single', {
      componentName,
      interfaceName: capitalizeFirst(queryName),
      hocFileName: path.basename(hocFileName, '.ts'),
      hocName: `with${componentName}`,
    })


    spinner.start('Creating component')
    await safelyWrite(componentDestPath, renderedComponent, true)
    spinner.succeed(`Component created: ${componentDestPath}.`)

    spinner.start('Creating story')
    await safelyWrite(storyDestPath, renderedStory, true)
    spinner.succeed(`Story created: ${storyDestPath}.`)

    spinner.start('Creating HOC')
    await safelyWrite(hocDestPath, renderedHoc, true)
    spinner.succeed(`HOC created: ${storyDestPath}.`)

    spinner.start('Creating Container')
    await safelyWrite(containerDestPath, renderedContainer, true)
    spinner.succeed(`Container created: ${storyDestPath}.`)

    spinner.start('Appending story')
    const appendedStory = await appendStory(storyRequirePath)
    if (appendedStory) {
      spinner.succeed(`Story appended: ${storyRequirePath}.`)
    } else {
      spinner.warn(`Story ${storyRequirePath} already registered.`)
    }
  } catch (err) {
    spinner.fail(err.toString())
    console.log(err)
  }
}
