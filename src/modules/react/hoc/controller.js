import path from 'path'
import fs from 'fs-extra'
import gql from 'graphql-tag'
import { render } from '../../common/template'
import { spinner } from '../../common/ui'
import { getFoldersPaths } from '../react-module/logic';

const capitalizeFirst = string => `${string[0].toUpperCase()}${string.slice(1)}`

const getQueryName = document => document.definitions[0].name.value

const camelToKebab = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const extractSDL = (fileContent) => {
  const groups = fileContent.replace('\n', '').match(/gql`([\s\S]*?)`/)
  return groups && groups[1]
}

const safelyWrite = async (destPath, content, force) => {
  const destExists = await fs.exists(destPath)
  if (!force && destExists) {
    throw new Error(`File ${destPath} already exists.`)
  }
  return fs.writeFile(destPath, content)
}

const safelyRead = async (filePath) => {
  const exists = await fs.pathExists(filePath)
  if (!exists) {
    throw new Error(`File ${filePath} does not exist.`)
  }

  return fs.readFile(filePath, 'utf8')
}

const getOperation = document => document.definitions[0].operation

export const createHoc = async (queryPath, force) => {
  spinner.start('Creating hoc...')
  try {
    const absolutePath = path.join(process.cwd(), queryPath)
    const fileContent = await safelyRead(absolutePath)
    const sdl = extractSDL(fileContent)
    const ast = gql`${sdl}`
    
    const operation = getOperation(ast)
    const name = getQueryName(ast)
    const fileName = path.basename(absolutePath, '.ts')
    const interfaceName = capitalizeFirst(name)
    const hocFileName = `with-${camelToKebab(name)}.ts`
    const destPath = path.join(queryPath, `../../hocs/${hocFileName}`) //  TODO: Improve this

    if (operation === 'query') {
      const nodeType = 'Entity'
     
      const renderedHoc = await render('hoc', {
        queryName: name,
        queryFileName: fileName,
        interfaceName,
        nodeType,
      })

      await safelyWrite(destPath, renderedHoc, force)
      spinner.succeed(`HOC ${destPath} created. [query]`)
    } else if (operation === 'mutation') {
      const renderedHoc = await render('hoc-mutation', {
        mutationName: name,
        mutationFileName: fileName,
        interfaceName,
      })
  
      await safelyWrite(destPath, renderedHoc, force)
      spinner.succeed(`HOC ${destPath} created. [mutation]`)
    }
  } catch (err) {
    spinner.fail(err.toString())
  }
}
