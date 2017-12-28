import * as path from 'path'
import { IContext } from '../../../../common/context'
import chalk from 'chalk'
import { safelyRead } from '../../../../services/fs/io'
import { getDocumentNode } from '../../../../common/graphql/info'
import { fetchInstrospectionSchema } from '../../../../services/graphql-endpoint/instrospection'
import { assembleModel, IModel, IField } from '../../../../common/graphql/model'
import { getSelectionsOfDefinitionByDefinitionName, getSelectionsByPath } from '../../../../common/graphql/document'
import { getTypeByPath } from '../../../../common/graphql/instrospection-schema'
import { IDispatchableFile } from '../../../../services/fs-dispatcher/types';
import { getModuleNameByAbsolutePath, getModuleFolder } from '../../../../common/logic/folders'
import { FolderNames, Templates, FileNames } from '../../../../common/constants'
import { camelToKebab, uncapitalizeFirst } from '../../../../common/string'
import { capitalizeFirst } from '../../../../modules/common/string';
import { render } from '../../../../common/template/render'

export interface IOptions {
  graphQLFilePath: string,
  force: boolean,
  graphQLUrl: string,
  pathToEntity: string[],
}

async function getListComponentFile(
  moduleFolder: string,
  definitionName: string,
  model: IModel,
): Promise<IDispatchableFile> {
  const componentName = `${capitalizeFirst(definitionName)}List`

  const content = await render(Templates.list.component, {
    componentName,
    arrayName: `${uncapitalizeFirst(definitionName)}`,
    entityName: model.name,
    props: model.fields,
  })
  const destPath = path.join(moduleFolder, FolderNames.components, componentName, FileNames.component)
  return {
    path: destPath,
    content,
  }
}

async function getListStoryFile(
  moduleFolder: string,
  componentName: string,
  arrayName: string,
): Promise<IDispatchableFile> {
  const content = await render(Templates.list.story, {
    componentName,
    arrayName,
  })
  const destPath = path.join(moduleFolder, FolderNames.components, componentName, FileNames.story)

  return {
    path: destPath,
    content,
  }
}
async function getListContainerFile(
  moduleFolder: string,
  componentName: string,
  hocFileName: string,
  entityName: string,
  queryName: string,
  arrayName: string,
): Promise<IDispatchableFile> {
  const content = await render(Templates.list.container, {
    componentName,
    hocFileName,
    entityName,
    queryName,
    arrayName,
  })
  const destPath = path.join(moduleFolder, FolderNames.containers, componentName, FileNames.component)

  return {
    path: destPath,
    content,
  }
}
const getHocFileName = (definitionName: string): string => `with-${camelToKebab(definitionName)}.ts`

async function getListHocFile(
  moduleFolder: string,
  definitionName: string,
  queryFileName: string,
  interfaceName: string,
  nodeType: string,
  props: IField[],
): Promise<IDispatchableFile> {
  const content = await render(Templates.list.container, {
    definitionName,
    queryFileName,
    interfaceName,
    nodeType,
    props,
  })
  const destPath = path.join(moduleFolder, FolderNames.containers, getHocFileName(definitionName))

  return {
    path: destPath,
    content,
  }
}

async function getListItemComponentFile(
  moduleFolder: string,
  componentName: string,
  props: IField[],
): Promise<IDispatchableFile> {
  const content = await render(Templates.listItem.component, {
    componentName,
    props,
  })
  const destPath = path.join(moduleFolder, FolderNames.containers, componentName, FileNames.component)

  return {
    path: destPath,
    content,
  }
}
async function getListItemStoryFile(
  moduleFolder: string,
  componentName: string,
): Promise<IDispatchableFile> {
  const content = await render(Templates.listItem.component, {
    componentName,
  })
  const destPath = path.join(moduleFolder, FolderNames.containers, componentName, FileNames.story)

  return {
    path: destPath,
    content,
  }
}

const log = (text: string) => console.log(text)

const displayInfo = (options: IOptions) => {
  log(chalk.grey('----------------------------------'))
  log(`${chalk.grey('GraphQL Document Path:')} ${chalk.green(options.graphQLFilePath)}`)
  log(`${chalk.grey('GraphQL Endpoint:')} ${chalk.green(options.graphQLUrl)}`)
  log(`${chalk.grey('Path to Entity:')} ${chalk.green(options.pathToEntity.join('.'))}`)
  log(chalk.grey('----------------------------------'))
}
export default async (options: IOptions, { ui, fileDispatcher, cwd }: IContext) => {
  const { graphQLFilePath, force, graphQLUrl, pathToEntity} = options
  const moduleName = getModuleNameByAbsolutePath(graphQLFilePath)
  if (!moduleName) {
    throw new Error('Could not define module')
  }
  const moduleFolder = await getModuleFolder(cwd, moduleName)
  const definitionName = pathToEntity[0]
  const selectionPath = pathToEntity.slice(1)

  const graphQLFileData = await safelyRead(graphQLFilePath)
  const document = getDocumentNode(graphQLFileData)
  const instrospectionSchema = await fetchInstrospectionSchema(graphQLUrl)
  const selectionsInsideDefinition = getSelectionsOfDefinitionByDefinitionName(definitionName, document.definitions)
  const selectionsByPath = getSelectionsByPath(selectionPath, selectionsInsideDefinition)
  if (!selectionsByPath) {
    throw new Error(`Could not obtain selections from ${pathToEntity}`)
  }
  const instrospectionType = getTypeByPath(selectionPath, instrospectionSchema)
  if (!instrospectionType) {
    throw new Error(`Could not obtain instrospection type from ${pathToEntity}`)
  }
  const model = assembleModel(instrospectionType, selectionsByPath)
  if (!model) {
    throw new Error(`Could not obtain model.`)
  }

  const listComponentFile = await getListComponentFile(moduleFolder, definitionName, model)

  // const listStoryFile = getListStoryFile()
  // const listContainerFile = getListContainerFile()
  // const listHocFile = getListHocFile()
  // const listItemComponentFile = getListItemComponentFile()
  // const listItemStoryFile = getListItemStoryFile()

  // // const graphQLFileInfo = getGraphQLFileInfo(graphQLFileData)
  // // console.log(graphQLFileInfo)

  ui.spinner.start('[ List-Pack ] Creating List Component ...')
  await fileDispatcher.dispatch(listComponentFile)
  ui.spinner.succeed()

  // ui.spinner.start('[ List-Pack ] Creating List Story ...')
  // await fileDispatcher.dispatch(listStoryFile)
  // ui.spinner.succeed()

  // ui.spinner.start('[ List-Pack ] Creating List Container ...')
  // await fileDispatcher.dispatch(listContainerFile)
  // ui.spinner.succeed()

  // ui.spinner.start('[ List-Pack ] Creating List HOC ...')
  // await fileDispatcher.dispatch(listHocFile)
  // ui.spinner.succeed()

  // ui.spinner.start('[ List-Pack ] Creating List Item Component ...')
  // await fileDispatcher.dispatch(listItemComponentFile)
  // ui.spinner.succeed()

  // ui.spinner.start('[ List-Pack ] Creating List Item Story ...')
  // await fileDispatcher.dispatch(listItemStoryFile)
  // ui.spinner.succeed()

}
