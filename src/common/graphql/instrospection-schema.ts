import { IntrospectionSchema, IntrospectionType, IntrospectionTypeRef } from 'graphql'
const ROOT_TYPE = 'Query'
const OBJECT_TYPE = 'OBJECT'

// export const getTypeByPath = (searchPath: string[], types: any, currentType: any = null): any => {


//   if (!currentType) {
//     const queryType = types.find((type) => type.name === ROOT_TYPE)
//     return getTypeByPath(searchPath, types, queryType)
//   }

//   const nextSearch = searchPath[0]
//   const field = currentType.fields.find((type) => type.name === nextSearch)
//   if (!field) {
//     throw new Error('incorrect searchPath')
//   }

//   const nextSearchType = field.type.ofType
//   if (nextSearchType.kind !== OBJECT_TYPE) {
//     throw new Error('field in searchPath is not an object')
//   }

//   const newCurrentType = types.find((type) => type.name === nextSearchType.name)
//   return getTypeByPath(searchPath.slice(1), types, newCurrentType)
// }


const getNamedType = (instrospectionType: IntrospectionTypeRef): string => {
  if (instrospectionType.kind === 'LIST' || instrospectionType.kind === 'NON_NULL') {
    return getNamedType(instrospectionType.ofType)
  } else {
    return instrospectionType.name
  }
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
