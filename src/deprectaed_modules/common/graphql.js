import gql from 'graphql-tag'
import path from 'path'
import { safelyRead } from './files';

export const getDocumentQueryName = document => document.definitions[0].name.value

export const extractSDL = (fileContent) => {
  const groups = fileContent.replace('\n', '').match(/gql`([\s\S]*?)`/)
  return groups && groups[1]
}

export const getDocumentOperation = document => document.definitions[0].operation

export const getInfoFromGraphQLFile = async (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath)
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