import path from 'path'
import fs from 'fs-extra'
import { safelyRead, safelyWrite } from '../../common/files';
import { render } from '../../common/template';
import { spinner } from '../../common/ui';
import { getInfoFromGraphQLFile } from '../../common/graphql';
import { capitalizeFirst, camelToKebab } from '../../common/string';
import { createHoc } from '../hoc/controller'
import { getModuleName, getStoriesFilePath } from '../../common/folder-structure';
import { getAppendedStoryFileContent } from '../../common/stories'

export const createListItem = async (queryPath) => {
  spinner.start('Creating list item')
  try {
    const {
      operation,
      name,
    } = await getInfoFromGraphQLFile(queryPath)

    if (operation !== 'query') {
      throw new Error('Must provide a graphql QUERY')
    }

    const componentName = `${capitalizeFirst(name)}ListItem`

    const renderedList = await render('component-list-item', {
      componentName,
    })
    const renderedStory = await render('story-list-item', {
      componentName,
    })

    const listFileName = 'index.tsx'
    const destFolder = path.join(queryPath, `../../components/${componentName}`)
    const destFile = path.join(destFolder, listFileName)
    const destStoryFile = path.join(destFolder, 'stories.tsx')
    const moduleName = getModuleName(queryPath)

    if (!fs.existsSync(destFolder)) {
      await fs.mkdir(destFolder)
    }
    await safelyWrite(destFile, renderedList, true) //  TODO: force
    await safelyWrite(destStoryFile, renderedStory, true)

    const storiesFilePath = await getStoriesFilePath(process.cwd())
    const storiesFileContent = await safelyRead(storiesFilePath)
    const newStoryRequirePath = `./modules/${moduleName}/components/${componentName}/stories`
    const storyAlreadyRegistered = storiesFileContent.indexOf(newStoryRequirePath) !== -1
    if (!storyAlreadyRegistered) {
      const newStoriesFileContent = getAppendedStoryFileContent(storiesFileContent, newStoryRequirePath)
      await safelyWrite(storiesFilePath, newStoriesFileContent, true)
      spinner.succeed(`List Component Item Story appended to ${storiesFilePath}`)
    } else {
      spinner.info(`List Component Item Story ${newStoryRequirePath} already registered`)
    }
    

    spinner.succeed(`List Component Item created ${destFile}`)
    spinner.succeed(`List Component Item Story created ${destStoryFile}`)
    
  } catch (err) {
    spinner.fail(err.toString())
  }
}

export const createList = async (queryPath) => {
  spinner.start('Creating list...')
  try {
    const {
      operation,
      name,
    } = await getInfoFromGraphQLFile(queryPath)

    if (operation !== 'query') {
      throw new Error('Must provide a graphql QUERY')
    }

    const componentName = `${capitalizeFirst(name)}List`

    const renderedList = await render('component-list', {
      componentName,
      arrayName: name,
      entityName: 'Entity',
    })

    const renderedStory = await render('story-list', {
      componentName,
      arrayName: name,
    })

    const listFileName = 'index.tsx'
    const destFolder = path.join(queryPath, `../../components/${componentName}`)
    const destFile = path.join(destFolder, listFileName)
    const destStoryFile = path.join(destFolder, 'stories.tsx')
    const moduleName = getModuleName(queryPath)

    if (!fs.existsSync(destFolder)) {
      await fs.mkdir(destFolder)
    }
    await safelyWrite(destFile, renderedList, true) //  TODO: force
    await safelyWrite(destStoryFile, renderedStory, true)

    const storiesFilePath = await getStoriesFilePath(process.cwd())
    const storiesFileContent = await safelyRead(storiesFilePath)
    const newStoryRequirePath = `./modules/${moduleName}/components/${componentName}/stories`
    const storyAlreadyRegistered = storiesFileContent.indexOf(newStoryRequirePath) !== -1
    if (!storyAlreadyRegistered) {
      const newStoriesFileContent = getAppendedStoryFileContent(storiesFileContent, newStoryRequirePath)
      await safelyWrite(storiesFilePath, newStoriesFileContent, true)
      spinner.succeed(`List Component Story appended to ${storiesFilePath}`)
    } else {
      spinner.info(`List Component Story ${newStoryRequirePath} already registered`)
    }

    spinner.succeed(`List Component created ${destFile}`)
    spinner.succeed(`List Component Story created ${destStoryFile}`)
  } catch (err) {
    spinner.fail(err.toString())
  }
}


export const createContainer = async (queryPath) => {
  spinner.start('Creating container...')
  try {
    const {
      operation,
      name,
    } = await getInfoFromGraphQLFile(queryPath)

    if (operation !== 'query') {
      throw new Error('Must provide a graphql QUERY')
    }

    const queryName = `${capitalizeFirst(name)}`
    const componentName = `${capitalizeFirst(name)}List`
    const hocFileName = `with-${camelToKebab(name)}`
    
    const renderedList = await render('container-list', {
      componentName,
      hocFileName,
      entityName: 'Entity',
      queryName,
      arrayName: name,
    })

    const listFileName = 'index.tsx'
    const destFolder = path.join(queryPath, `../../containers/${componentName}`)
    const destFile = path.join(destFolder, listFileName)

    if (!fs.existsSync(destFolder)) {
      await fs.mkdir(destFolder)
    }
    await safelyWrite(destFile, renderedList, true) //  TODO: force

    spinner.succeed(`List Container created ${destFile}`)
  } catch (err) {
    spinner.fail(err.toString())
  }
}


export const createListPack = async (queryPath) => {
  await createList(queryPath)
  await createListItem(queryPath)
  await createContainer(queryPath)
  await createHoc(queryPath, true)
}
