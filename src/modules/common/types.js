import fs from 'fs-extra'
import path from 'path'
import gql from 'graphql-tag';
import { safelyRead } from './files';
import { extractSDL } from './graphql';
import downloadSchema from './download-schema';

const ROOT_TYPE = 'Query'
const OBJECT_TYPE = 'OBJECT'

const getInnerType = type => type.ofType ? getInnerType(type.ofType) : type
const getTypesFromSchema = schema => schema.data.__schema.types
const findTypeByName = (types, name) => types.find(type => type.name === name)
const getNodeName = node => node.name.value
const getFieldType = (fieldName, typeDefinition) => typeDefinition.fields.find(field => field.name === fieldName)

export const compileKey = (graphQLType) => {
  if (graphQLType.type.kind === 'NON_NULL') {
    return graphQLType.name
  }
  return `${graphQLType.name}?`
}

export const compileValue = (graphQLType) => {
  if (!graphQLType.kind) {
    return compileValue(graphQLType.type)
  }
  switch (graphQLType.kind) {
    case 'LIST':
      return `Array<${compileValue(graphQLType.ofType)}>`
    case 'SCALAR':
      switch (graphQLType.name) {
        case 'String':
          return 'string'
        case 'Int':
          return 'number'
        case 'Float':
          return 'number'
        case 'Boolean':
          return 'boolean'
        case 'ID':
          return 'string'
        default:
          return 'any'
      }
    case 'NON_NULL':
      return compileValue(graphQLType.ofType)
    case 'OBJECT':
      switch (graphQLType.name) {
        default:
          return 'any'
      }
    default:
      throw new Error(`Unhandled type: ${graphQLType.kind}`)
  }
}
export const compileGraphQLTypeToTypeScript = graphQLType => ({
  key: compileKey(graphQLType),
  value: compileValue(graphQLType),
})

const getRequestedType = (searchPath, types, currentType = null) => {
  if (searchPath.length === 0) return currentType

  if (!currentType) {
    const queryType = findTypeByName(types, ROOT_TYPE)
    return getRequestedType(searchPath, types, queryType)
  }

  const nextSearch = searchPath[0]
  const field = findTypeByName(currentType.fields, nextSearch)
  if (!field) {
    throw new Error('incorrect searchPath')
  }

  const nextSearchType = getInnerType(field.type)
  if (nextSearchType.kind !== OBJECT_TYPE) {
    throw new Error('field in searchPath is not an object')
  }
  const newCurrentType = findTypeByName(types, nextSearchType.name)
  return getRequestedType(searchPath.slice(1), types, newCurrentType)
}

const getRequestedFields = (searchPath, document, currentNode) => {
  if (!searchPath.length) return currentNode
  if (!currentNode) return getRequestedFields(searchPath, document, document.definitions)

  const currentSearch = searchPath[0]
  const nextNode = currentNode.find(selection => getNodeName(selection) === currentSearch)
  return getRequestedFields(searchPath.slice(1), document, nextNode.selectionSet.selections)
}

export const getAstFromGraphQLFile = async (graphQLFilePath) => {
  const fileContent = await safelyRead(graphQLFilePath)
  const sdl = extractSDL(fileContent)
  return gql`${sdl}`
}

export default async (queryName, searchPath, graphQLFileRelativePath, graphQLUrl) => {
  const graphQLFilePath = path.resolve(process.cwd(), graphQLFileRelativePath)
  const ast = await getAstFromGraphQLFile(graphQLFilePath)
  const schema = await downloadSchema(graphQLUrl)
  const types = getTypesFromSchema(schema)
  // return;
  const requestedFields = getRequestedFields([queryName, ...searchPath], ast)
  const requestedType = getRequestedType(searchPath, types)

  return requestedFields.map(field => ({
    name: getNodeName(field),
    type: compileGraphQLTypeToTypeScript(getFieldType(getNodeName(field), requestedType)),
  }))
}
