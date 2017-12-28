// import { getTypeForPath } from './types'
import { SelectionNode, IntrospectionType } from 'graphql'
import { compileGraphQLTypeToTypeScript, ITypeScriptType } from './graphql-to-typescript'

export interface IField {
  name: string;
  typescript: ITypeScriptType
}
export interface IModel {
  name: string;
  fields: Array<IField | null>  // | null is just a workaround for type-guard on Array.filter
}
/**
 *
 * @param entityPath Array<string> - Path to the entity. ['viewer', 'allCharaceters', 'edges', 'node']
 * @param instrospectionSchema InstrospectionSchema - Instrospected from remote server
 * @param selectionNodes SelectionNode[] - Selections extracted from our query
 */
export const assembleModel = (instrospectionType: IntrospectionType, selectionNodes: SelectionNode[]): IModel | null => {
  if (instrospectionType.kind === 'OBJECT' && instrospectionType.name) {
    const fields = selectionNodes.map((selectionNode) => {
      if (selectionNode.kind === 'Field') {
        const selectionFieldName = selectionNode.name.value
        const fieldToBeCompiled = instrospectionType.fields.find((field) => field.name === selectionFieldName)
        return {
          name: selectionFieldName,
          typescript: compileGraphQLTypeToTypeScript(fieldToBeCompiled),
        }
      }
      return null
    }).filter((field: IField | null) => field !== null)

    return {
      name: instrospectionType.name,
      fields,
    }
  }
  return null
}
