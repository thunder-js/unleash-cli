import path from 'path'
import fs from 'fs-extra'
import gql from 'graphql-tag'
import { render } from '../../common/template'
import { spinner } from '../../common/ui'

const capitalizeFirst = string => `${string[0].toUpperCase()}${string.slice(1)}`

const getQueryName = document => document.definitions[0].name.value

const camelToKebab = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const createHoc = async (queryPath) => {
  spinner.start('Creating hoc...')
  const queryAbsolutePath = path.join(process.cwd(), queryPath)
  const exists = await fs.pathExists(queryAbsolutePath)
  if (!exists) {
    return spinner.fail(`File ${queryAbsolutePath} does not exist.`)
  }

  const queryContent = await fs.readFile(queryAbsolutePath)
  const ast = gql`${queryContent}`
  const queryName = getQueryName(ast)
  const queryFileName = path.basename(queryAbsolutePath)
  const interfaceName = capitalizeFirst(queryName)
  const hocFileName = `with-${camelToKebab(queryName)}.ts`
  const destPath = path.join(queryPath, `../../hocs/${hocFileName}`) //  TODO: Improve this

  const destExists = await fs.exists(destPath)
  if (destExists) {
    return spinner.fail(`File ${destPath} already exists.`)    
  }
  const renderedHoc = await render('hoc', {
    queryName,
    queryFileName,
    interfaceName,
  })

  await fs.writeFile(destPath, renderedHoc)
  spinner.succeed(`HOC ${destPath} created.`)
}
