import * as path from 'path'
import chalk from 'chalk'
import { IContext } from '../../../../common/context'
import { safelyRead } from '../../../../services/fs/io'
import { getDocumentNode, extractSDL } from '../../../../common/graphql/info'
import { fetchInstrospectionSchema } from '../../../../services/graphql-endpoint/instrospection'
import { requestGraphQL } from '../../../../services/graphql-endpoint/query'
import { assembleModel, IModel } from '../../../../common/graphql/model'
import { getSelectionsOfDefinitionByDefinitionName, getSelectionsByPath } from '../../../../common/graphql/document'
import { getTypeByPath } from '../../../../common/graphql/instrospection-schema'
import { IDispatchableFile } from '../../../../services/fs-dispatcher/types';
import { getModuleNameByAbsolutePath, getModuleFolder } from '../../../../common/logic/folders'
import { FolderNames, Templates, FileNames } from '../../../../common/constants'
import { camelToKebab, uncapitalizeFirst, capitalizeFirst } from '../../../../common/string'
import { render } from '../../../../common/template/render'
import * as R from 'ramda'
import { isNumber } from 'util';

export interface IOptions {
  graphQLFilePath: string,
  force: boolean,
  graphQLUrl: string,
  pathToEntity: string[],
}

const getListItemComponentFileName = (definitionName: string): string => `${capitalizeFirst(definitionName)}ListItem`
const getInterfaceName = (definitionName: string): string => capitalizeFirst(definitionName)
const getHocName = (definitionName: string): string => `with${capitalizeFirst(definitionName)}`
const getHocFileName = (definitionName: string): string => `with-${camelToKebab(definitionName)}.ts`
const getListComponentName = (definitionName: string): string => `${capitalizeFirst(definitionName)}List`
const getArrayName = (definitionName: string): string => `${uncapitalizeFirst(definitionName)}`

async function getListComponentFile(
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

async function getListStoryFile(
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

async function getListContainerFile(
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

async function getListHocFile(
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

async function getListItemComponentFile(
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
async function getListItemStoryFile(
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

const log = (text: string) => console.log(text)

const displayInfo = (options: IOptions) => {
  log(chalk.grey('----------------------------------'))
  log(`${chalk.grey('GraphQL Document Path:')} ${chalk.green(options.graphQLFilePath)}`)
  log(`${chalk.grey('GraphQL Endpoint:')} ${chalk.green(options.graphQLUrl)}`)
  log(`${chalk.grey('Path to Entity:')} ${chalk.green(options.pathToEntity.join('.'))}`)
  log(chalk.grey('----------------------------------'))
}

const getType = (value: any) => {
  if (isNumber(value)) {
    return 'number'
  }
  if (value.indexOf('\n') !== -1) {
    return 'multiline-string'
  }
  return 'string'
}

const mapObjectToPropsArray = (object) => Object.keys(object).map((key) => ({
  key,
  value: getType(object[key]) === 'multiline-string' ? object[key].replace(/\r/g, '') : object[key],
  type: getType(object[key]),
}))
export default async (options: IOptions, { ui, fileDispatcher, cwd }: IContext) => {
  const { graphQLFilePath, force, graphQLUrl, pathToEntity} = options
  const moduleName = getModuleNameByAbsolutePath(graphQLFilePath)
  if (!moduleName) {
    throw new Error('Could not define module')
  }
  const moduleFolder = await getModuleFolder(cwd, moduleName)
  const definitionName = pathToEntity[0]
  const selectionPath = pathToEntity.slice(1)
  const graphQLFileName = path.basename(graphQLFilePath, '.ts')

  const graphQLFileData = await safelyRead(graphQLFilePath)
  const query = await extractSDL(graphQLFileData)
  if (!query) {
    throw new Error(`Could not obtain query from ${graphQLFilePath}`)
  }
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

  const fetchedData = await requestGraphQL(graphQLUrl, query)
  const pathToArray = pathToEntity.slice(1, -1)
  const entityArrayData = R.pathOr([], pathToArray, fetchedData).map((edge: {node: any}) => edge.node)

  const listComponentFile = await getListComponentFile(moduleFolder, definitionName, model)
  const listStoryFile = await getListStoryFile(moduleFolder, definitionName, entityArrayData)
  const listContainerFile = await getListContainerFile(moduleFolder, definitionName, model)
  const listHocFile = await getListHocFile(moduleFolder, graphQLFileName, definitionName, model)
  const listItemComponentFile = await getListItemComponentFile(moduleFolder, definitionName, model)
  const listItemStoryFile = await getListItemStoryFile(moduleFolder, definitionName, entityArrayData[0])

  ui.spinner.start('[ List-Pack ] Creating List Component ...')
  await fileDispatcher.dispatch(listComponentFile)
  ui.spinner.succeed()

  ui.spinner.start('[ List-Pack ] Creating List Story ...')
  await fileDispatcher.dispatch(listStoryFile)
  ui.spinner.succeed()

  ui.spinner.start('[ List-Pack ] Creating List Container ...')
  await fileDispatcher.dispatch(listContainerFile)
  ui.spinner.succeed()

  ui.spinner.start('[ List-Pack ] Creating List HOC ...')
  await fileDispatcher.dispatch(listHocFile)
  ui.spinner.succeed()

  ui.spinner.start('[ List-Pack ] Creating List Item Component ...')
  await fileDispatcher.dispatch(listItemComponentFile)
  ui.spinner.succeed()

  ui.spinner.start('[ List-Pack ] Creating List Item Story ...')
  await fileDispatcher.dispatch(listItemStoryFile)
  ui.spinner.succeed()
}
