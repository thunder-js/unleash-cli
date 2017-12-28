import gql from 'graphql-tag'
import { DocumentNode, OperationTypeNode } from 'graphql';

export interface IGraphQLFileInfo {
  name: string | null;
  operation: OperationTypeNode | null;
}
export const getDocumentOperationName = (documentNode: DocumentNode): string | null => {
  const firstDefinition = documentNode.definitions[0]
  if (firstDefinition.kind === 'OperationDefinition') {
    return firstDefinition.name ? firstDefinition.name.value : null
  }
  return null
}

export const getDocumentOperation = (documentNode: DocumentNode): OperationTypeNode | null => {
  const firstDefinition = documentNode.definitions[0]
  if (firstDefinition.kind === 'OperationDefinition') {
    return firstDefinition.operation
  }
  return null
}

export const extractSDL = (graphQLFileData: string): string | null => {
  const groups = graphQLFileData.replace('\n', '').match(/gql`([\s\S]*?)`/)
  return groups && groups[1]
}

export const getDocumentNode = (graphQLFileData: string): DocumentNode => {
  const sdl = extractSDL(graphQLFileData)
  const ast = gql`${sdl}`
  return ast
}

export const getGraphQLFileInfo = (graphQLFileData: string): IGraphQLFileInfo => {
  const document = getDocumentNode(graphQLFileData)
  const operation = getDocumentOperation(document)
  const name = getDocumentOperationName(document)

  return {
    operation,
    name,
  }
}
