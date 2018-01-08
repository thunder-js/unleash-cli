import path from 'path'
import fs from 'fs-extra'
import gql from 'graphql-tag'
import { render } from '../../common/template'
import { spinner } from '../../common/ui'
import { safelyRead, safelyWrite } from '../../common/files'
import { capitalizeFirst, camelToKebab } from '../../common/string'
import { getDocumentQueryName, getDocumentOperation, extractSDL } from '../../common/graphql'
import getModel from '../../common/types'

export const createHoc = async (queryPath, graphQLUrl, searchPath) => {
  spinner.start('Creating hoc...')
  try {
    const absolutePath = path.join(process.cwd(), queryPath)
    const fileContent = await safelyRead(absolutePath)
    const sdl = extractSDL(fileContent)
    const ast = gql`${sdl}`

    const operation = getDocumentOperation(ast)
    const name = getDocumentQueryName(ast)
    const fileName = path.basename(absolutePath, '.ts')
    const interfaceName = capitalizeFirst(name)
    const hocFileName = `with-${camelToKebab(name)}.ts`
    const destPath = path.join(queryPath, `../../hocs/${hocFileName}`) //  TODO: Improve this
    const props = await getModel(name, searchPath, queryPath, graphQLUrl)

    if (operation === 'query') {
      const nodeType = 'Entity'

      const renderedHoc = await render('hoc', {
        queryName: name,
        queryFileName: fileName,
        interfaceName,
        nodeType,
        props,
      })

      await safelyWrite(destPath, renderedHoc, true)
      spinner.succeed(`HOC ${destPath} created. [query]`)
    } else if (operation === 'mutation') {
      const renderedHoc = await render('hoc-mutation', {
        mutationName: name,
        mutationFileName: fileName,
        interfaceName,
      })

      await safelyWrite(destPath, renderedHoc, true)
      spinner.succeed(`HOC ${destPath} created. [mutation]`)
    }
  } catch (err) {
    spinner.fail(err.toString())
  }
}
