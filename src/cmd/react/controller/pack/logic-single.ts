import { IDispatchableFile } from '../../model/dispatchable-file'
import { render } from '../../../../common/template/render'
import { FolderNames, Templates, FileNames } from '../../../../common/constants'
import { getHocFileName, getSingleComponentFileName, getInterfaceName, getHocName } from './logic'
import { uncapitalizeFirst, camelToKebab } from '../../../../common/string'
import { IModel } from '../../../../common/graphql/model'
import * as path from 'path'
import { capitalizeFirst } from '../../../../modules/common/string';

const getDataNamespace = (definitionName: string): string => uncapitalizeFirst(definitionName)
const getSingleContainerFileName = (definitionName: string): string => capitalizeFirst(definitionName)

export async function getSingleComponentFile(
  moduleFolder: string,
  definitionName: string,
  model: IModel,
): Promise<IDispatchableFile> {
  const componentName = getSingleComponentFileName(definitionName)
  const content = await render(Templates.single.component, {
    componentName,
    dataNamespace: getDataNamespace(definitionName),
    props: model.fields,
  })
  const destPath = path.join(moduleFolder, FolderNames.components, componentName, FileNames.component)
  return {
    content,
    path: destPath,
  }
}
export async function getSingleStoryFile(
  moduleFolder: string,
  definitionName: string,
  data: any,
): Promise<IDispatchableFile> {
  // TODO: Remove "key":
  // const reg = /"([^,]*?)":/g
  const componentName = getSingleComponentFileName(definitionName)
  const content = await render(Templates.single.story, {
    componentName,
    data,
    dataNamespace: getDataNamespace(definitionName),
  })
  const destPath = path.join(moduleFolder, FolderNames.components, componentName, FileNames.story)
  return {
    content,
    path: destPath,
  }
}

export async function getSingleHocFile(
  moduleFolder: string,
  definitionName: string,
  model: IModel,
  selectionPath: string[],
): Promise<IDispatchableFile> {
  const content = await render(Templates.single.hoc, {
    queryName: definitionName,
    queryFileName: camelToKebab(definitionName),
    interfaceName: getInterfaceName(definitionName),
    entityName: model.name,
    props: model.fields,
    dataNamespace: getDataNamespace(definitionName),
    pathToEntity: selectionPath,
  })
  const destPath = path.join(moduleFolder, FolderNames.hocs, getHocFileName(definitionName))
  return {
    content,
    path: destPath,
  }
}
export async function getSingleContainerFile(
  moduleFolder: string,
  definitionName: string,
): Promise<IDispatchableFile> {
  const componentName = getSingleComponentFileName(definitionName)
  const content = await render(Templates.single.container, {
    componentName,
    interfaceName: getInterfaceName(definitionName),
    hocFileName: getHocFileName(definitionName),
    hocName: getHocName(definitionName),
  })
  const destPath = path.join(moduleFolder, FolderNames.containers, componentName, FileNames.container)
  return {
    content,
    path: destPath,
  }
}
