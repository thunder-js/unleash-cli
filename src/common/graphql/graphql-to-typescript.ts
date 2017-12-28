export const compileKey = (graphQLType: any): string => {
  if (graphQLType.type.kind === 'NON_NULL') {
    return graphQLType.name
  }
  return `${graphQLType.name}?`
}

export const compileValue = (graphQLType: any): string => {
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

export interface ITypeScriptType {
  key: string;
  value: string;
}
export const compileGraphQLTypeToTypeScript = (graphQLType: any): ITypeScriptType => ({
  key: compileKey(graphQLType),
  value: compileValue(graphQLType),
})
