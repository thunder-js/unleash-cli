import { render } from '../../../../common/template/render'
import { IDispatchableFile } from '../../model/dispatchable-file'
import { IModel } from '../../../../common/graphql/model'
import { Templates, FolderNames, FileNames } from '../../../../common/constants'
import * as path from 'path'
import { uncapitalizeFirst, capitalizeFirst, camelToKebab } from '../../../../common/string'

export const getListItemComponentFileName = (definitionName: string): string => `${capitalizeFirst(definitionName)}ListItem`
export const getInterfaceName = (definitionName: string): string => capitalizeFirst(definitionName)
export const getHocName = (definitionName: string): string => `with${capitalizeFirst(definitionName)}`
export const getHocFileName = (definitionName: string): string => `with-${camelToKebab(definitionName)}.ts`
export const getListComponentName = (definitionName: string): string => `${capitalizeFirst(definitionName)}List`
export const getArrayName = (definitionName: string): string => `${uncapitalizeFirst(definitionName)}`

export async function getListComponentFile(
  moduleFolder: string,
  definitionName: string,
  model: IModel,
): Promise<IDispatchableFile> {
  const content = await render(Templates.list.component, {
    componentName: getListComponentName(definitionName),
    arrayName: getArrayName(definitionName),
    entityName: model.name,
    props: model.fields,
  })
  const destPath = path.join(moduleFolder, FolderNames.components, getListComponentName(definitionName), FileNames.component)
  return {
    path: destPath,
    content,
  }
}

export async function getListStoryFile(
  moduleFolder: string,
  definitionName: string,
  fakeDataArray: any,
): Promise<IDispatchableFile> {
  const content = await render(Templates.list.story, {
    componentName: getListComponentName(definitionName),
    arrayName: getArrayName(definitionName),
    fakeDataArray,
  })
  const destPath = path.join(moduleFolder, FolderNames.components, getListComponentName(definitionName), FileNames.story)

  return {
    path: destPath,
    content,
  }
}

export async function getListContainerFile(
  moduleFolder: string,
  definitionName: string,
  model: IModel,
): Promise<IDispatchableFile> {
  const content = await render(Templates.list.container, {
    componentName: getListComponentName(definitionName),
    hocName: getHocName(definitionName),
    hocFileName: getHocFileName(definitionName),
    entityName: model.name,
    arrayName: getArrayName(definitionName),
    interfaceName: getInterfaceName(definitionName),
  })
  const destPath = path.join(moduleFolder, FolderNames.containers, getListComponentName(definitionName), FileNames.component)

  return {
    path: destPath,
    content,
  }
}

export async function getListHocFile(
  moduleFolder: string,
  queryFileName: string,
  definitionName: string,
  model: IModel,
): Promise<IDispatchableFile> {
  const content = await render(Templates.list.hoc, {
    definitionName,
    queryFileName,
    interfaceName: getInterfaceName(definitionName),
    entityName: model.name,
    props: model.fields,
  })
  const destPath = path.join(moduleFolder, FolderNames.hocs, getHocFileName(definitionName))

  return {
    path: destPath,
    content,
  }
}

export async function getListItemComponentFile(
  moduleFolder: string,
  definitionName: string,
  model: IModel,
): Promise<IDispatchableFile> {
  const content = await render(Templates.listItem.component, {
    componentName: getListItemComponentFileName(definitionName),
    props: model.fields,
  })
  const destPath = path.join(moduleFolder, FolderNames.components, getListItemComponentFileName(definitionName), FileNames.component)
  return {
    path: destPath,
    content,
  }
}
export async function getListItemStoryFile(
  moduleFolder: string,
  definitionName: string,
  fakeData: any,
): Promise<IDispatchableFile> {
  const componentName = getListItemComponentFileName(definitionName)

  const content = await render(Templates.listItem.story, {
    componentName,
    fakeData,
  })
  const destPath = path.join(moduleFolder, FolderNames.components, componentName, FileNames.story)

  return {
    path: destPath,
    content,
  }
}
// export async function getAppendedListItemStoryFile(
//   moduleFolder: string,
//   definitionName: string,
//   fakeData: any,
//   storiesFilePath: string,
//   storiesFileContent: string,
//   moduleName: string,
// ): Promise<IDispatchableFile[]> {
//   const listItemStoryFile = await getListItemStoryFile(moduleFolder, definitionName, fakeData)
//   const storiesFile = await getAppendedStoryFile(storiesFilePath, storiesFileContent, moduleName, getListItemComponentFileName(definitionName))
//   return [listItemStoryFile, storiesFile]
// }

export const getAppendedStoryFileContent = (stories, newStoryPath) => `${stories}require('${newStoryPath}');\n`
export const getStoryRequirePath = (moduleName: string, componentName: string) => `./modules/${moduleName}/components/${componentName}/stories`
export const isStoryAlreadyRegistered = (moduleName: string, componentName: string, storiesFileContent: string) => {
  return storiesFileContent.indexOf(getStoryRequirePath(moduleName, componentName)) !== -1
}

export async function getAppendedStoryFile(
  storiesFilePath: string,
  storiesFileContent: string,
  stories: Array<{
    moduleName: string,
    componentName: string,
  }>,
): Promise<IDispatchableFile> {
  const appendedStoryFileContent = stories.reduce((acc, component) => {
    const newStoryRequirePath = getStoryRequirePath(component.moduleName, component.componentName)
    return getAppendedStoryFileContent(acc, newStoryRequirePath)
  }, storiesFileContent)

  return {
    path: storiesFilePath,
    content: appendedStoryFileContent,
  }
}


export const getStoriesToAppend = (moduleName: string, components: string[], storiesFileContent: string) => {
  return components.reduce((stories, component) => {
    const alreadyRegistered = isStoryAlreadyRegistered(moduleName, component, storiesFileContent)
    if (alreadyRegistered) {
      return stories
    }
    return [
      ...stories,
      {
        moduleName,
        componentName: component,
      },
    ]
  }, [])
}
