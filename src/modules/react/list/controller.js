import path from 'path'
import fs from 'fs-extra'
import gql from 'graphql-tag';
import { safelyRead, safelyWrite } from '../../common/files';
import { render } from '../../common/template';
import { spinner } from '../../common/ui';
import { extractSDL, getDocumentOperation, getDocumentQueryName } from '../../common/graphql';
import { capitalizeFirst, camelToKebab } from '../../common/string';
import { createHoc } from '../hoc/controller'

const getAbsolutePath = relativePath => path.join(process.cwd(), relativePath)

const getInfoFromGraphQLFile = async (filePath) => {
  const absolutePath = getAbsolutePath(filePath)
  const fileContent = await safelyRead(absolutePath)
  const sdl = extractSDL(fileContent)
  const ast = gql`${sdl}`

  const operation = getDocumentOperation(ast)
  const name = getDocumentQueryName(ast)

  return {
    operation,
    name,
  }
}

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
      componentName
    })

    const listFileName = 'index.tsx'
    const destFolder = path.join(queryPath, `../../components/${componentName}`)
    const destFile = path.join(destFolder, listFileName)
    const destStoryFile = path.join(destFolder, 'stories.tsx')

    if (!fs.existsSync(destFolder)) {
      await fs.mkdir(destFolder)
    }
    await safelyWrite(destFile, renderedList, true) //  TODO: force
    await safelyWrite(destStoryFile, renderedStory, true)

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

    if (!fs.existsSync(destFolder)) {
      await fs.mkdir(destFolder)
    }
    await safelyWrite(destFile, renderedList, true) //  TODO: force
    await safelyWrite(destStoryFile, renderedStory, true)
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
  Promise.all([createList(queryPath), createListItem(queryPath), createContainer(queryPath), createHoc(queryPath, true)])
}
