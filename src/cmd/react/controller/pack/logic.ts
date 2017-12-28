import { render } from '../../../../common/template/render'
import { IDispatchableFile } from '../../model/dispatchable-file'
import { IModel } from '../../../../common/graphql/model'
import { Templates, FolderNames, FileNames } from '../../../../common/constants'
import * as path from 'path'
import { uncapitalizeFirst, capitalizeFirst, camelToKebab } from '../../../../common/string'

const getListItemComponentFileName = (definitionName: string): string => `${capitalizeFirst(definitionName)}ListItem`
const getInterfaceName = (definitionName: string): string => capitalizeFirst(definitionName)
const getHocName = (definitionName: string): string => `with${capitalizeFirst(definitionName)}`
const getHocFileName = (definitionName: string): string => `with-${camelToKebab(definitionName)}.ts`
const getListComponentName = (definitionName: string): string => `${capitalizeFirst(definitionName)}List`
const getArrayName = (definitionName: string): string => `${uncapitalizeFirst(definitionName)}`

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
    arrayName: uncapitalizeFirst(definitionName),
    interfaceName: capitalizeFirst(definitionName),
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
  const content = await render(Templates.listItem.story, {
    componentName: getListItemComponentFileName(definitionName),
    fakeData,
  })
  const destPath = path.join(moduleFolder, FolderNames.components, getListItemComponentFileName(definitionName), FileNames.story)

  return {
    path: destPath,
    content,
  }
}
