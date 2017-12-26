import pkgDir from 'pkg-dir'
import path from 'path'
import { SRC_DIR } from '../../common/constants'
import { MODULES_DIR } from '../../react/react-module/constants'

// const url = 'https://api.graph.cool/relay/v1/cjbi3txqv0reu0121coxa0nsa'

// const ROOT_TYPE = 'Query'
// const OBJECT_TYPE = 'OBJECT'

// const getInnerType = type => type.ofType ? getInnerType(type.ofType) : type
// const getTypesFromSchema = schema => schema.data.__schema.types
// const findTypeByName = (types, name) => types.find(type => type.name === name)

// const getTypeByPath = (searchPath, types, currentType = null) => {
//   if (searchPath.length === 0) return currentType

//   if (!currentType) {
//     const queryType = findTypeByName(types, ROOT_TYPE)
//     return getTypeByPath(searchPath, types, queryType)
//   }

//   const nextSearch = searchPath[0]
//   const field = findTypeByName(currentType.fields, nextSearch)
//   if (!field) {
//     throw new Error('incorrect searchPath')
//   }

//   const nextSearchType = getInnerType(field.type)
//   if (nextSearchType.kind !== OBJECT_TYPE) {
//     throw new Error('field in searchPath is not an object')
//   }
//   const newCurrentType = findTypeByName(types, nextSearchType.name)
//   return getTypeByPath(searchPath.slice(1), types, newCurrentType)
// }

// //  [query, viewer, allCharacters, edges, node]

// const getNodeName = node => node.name.value

// const getNodeByPath = (searchPath, document, currentNode) => {
//   if (!searchPath.length) return currentNode

//   if (!currentNode) {
//     return getNodeByPath(searchPath, document, document.definitions)
//   }

//   const currentSearch = searchPath[0]
//   const nextNode = currentNode.find(selection => getNodeName(selection) === currentSearch)
//   return getNodeByPath(searchPath.slice(1), document, nextNode.selectionSet.selections)
// }

// const getFieldType = (fieldName, typeDefinition) => {
//   return typeDefinition.fields.find(field => field.name === fieldName)
// }

// export default () => {

//   const requestedFields = getNodeByPath(['ALL_CHARACTERS', 'viewer', 'allCharacters', 'edges', 'node'], ast)
//   const requestedType = getTypeByPath(['viewer', 'allCharacters', 'edges', 'node'], types)

//   const model = requestedFields.map(field => ({
//     name: getNodeName(field),
//     type: getFieldType(getNodeName(field), requestedType)
//   }))
// }

export const getModulesFolder = async (cwd) => {
  const projectRootFolder = await pkgDir(cwd)
  return projectRootFolder ? path.join(projectRootFolder, SRC_DIR, MODULES_DIR) : null
}

export const getComponentsFolder = async (cwd) => {
  return path.join(getModulesFolder(cwd), 'components')
}

export const getHocsFolder = async (cwd) => {
  return path.join(getModulesFolder(cwd), 'hocs')
}