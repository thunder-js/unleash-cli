export const getDocumentQueryName = document => document.definitions[0].name.value

export const extractSDL = (fileContent) => {
  const groups = fileContent.replace('\n', '').match(/gql`([\s\S]*?)`/)
  return groups && groups[1]
}

export const getDocumentOperation = document => document.definitions[0].operation
