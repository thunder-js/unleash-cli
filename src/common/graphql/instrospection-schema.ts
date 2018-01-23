import { IntrospectionSchema, IntrospectionType, IntrospectionTypeRef } from 'graphql'

const getNamedType = (instrospectionType: IntrospectionTypeRef): string => {
  console.log(instrospectionType)
  return 'FIXME'
  // if (instrospectionType.kind === 'LIST' || instrospectionType.kind === 'NON_NULL') {
  //   return getNamedType(instrospectionType.ofType)
  // } else {
  //   return instrospectionType.name
  // }
}

export const getTypeByPath = (searchPath: string[], instrospectionSchema: IntrospectionSchema, currentType: IntrospectionType | undefined | null = null): IntrospectionType | undefined | null => {
  if (searchPath.length === 0) {
    return currentType
  }
  if (!currentType) {
    const queryType = instrospectionSchema.types.find((type) => type.name === instrospectionSchema.queryType.name)
    return getTypeByPath(searchPath, instrospectionSchema, queryType)
  }

  const nextSearch = searchPath[0]

  if (currentType.kind === 'OBJECT') {
    const field = currentType.fields.find((type) => type.name === nextSearch)
    if (!field) {
      throw new Error(`Could not find field ${nextSearch} inside ${currentType.name}`)
    }
    const namedType = getNamedType(field.type)

    const newCurrentType = instrospectionSchema.types.find((type) => type.name === namedType)
    return getTypeByPath(searchPath.slice(1), instrospectionSchema, newCurrentType)
  }
  return null
}
