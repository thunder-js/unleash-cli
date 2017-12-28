import { DefinitionNode, SelectionNode, DocumentNode } from 'graphql'

export const getSelectionsOfDefinitionByDefinitionName = (definitionName: string, definitionNodes: DefinitionNode[]): SelectionNode[] | null => {
  const definitionNode =  definitionNodes.find((node: DefinitionNode) => {
    if (node.kind === 'OperationDefinition') {
      const name = node.name && node.name.value
      return definitionName === name
    }
    return false
  })

  if (definitionNode && definitionNode.kind === 'OperationDefinition') {
    return definitionNode.selectionSet.selections
  }
  return null
}

export const getSelectionsByPath = (searchPath: string[], selectionNodes: SelectionNode[] | undefined | null): SelectionNode[] | null => {
  if (!selectionNodes) {
    return null
  }
  if (!searchPath.length) {
    return selectionNodes
  }

  const currentSearch = searchPath[0]

  const nextSelectionNode = selectionNodes.find((definitionNode: SelectionNode) => {
    if (definitionNode.kind === 'Field') {
      return currentSearch === definitionNode.name.value
    }
    return false
  })

  if (nextSelectionNode && nextSelectionNode.kind === 'Field') {
    const newSelectionNodes = nextSelectionNode.selectionSet && nextSelectionNode.selectionSet.selections
    return getSelectionsByPath(searchPath.slice(1), newSelectionNodes)
  }
  return null
}
