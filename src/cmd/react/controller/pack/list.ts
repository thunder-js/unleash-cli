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
import { getModuleNameByAbsolutePath, getModuleFolder } from '../../../../common/logic/folders'
import * as R from 'ramda'
import {
  getListComponentFile,
  getListStoryFile,
  getListContainerFile,
  getListHocFile,
  getListItemComponentFile,
  getListItemStoryFile,
} from './logic'
import UI from '../../../../services/ui/ui';

export interface IOptions {
  graphQLFilePath: string,
  force: boolean,
  graphQLUrl: string,
  pathToEntity: string[],
}

const displayInfo = (options: IOptions, ui: UI) => {
  ui.log(chalk.grey('----------------------------------'))
  ui.log(`${chalk.grey('GraphQL Document Path:')} ${chalk.green(options.graphQLFilePath)}`)
  ui.log(`${chalk.grey('GraphQL Endpoint:')} ${chalk.green(options.graphQLUrl)}`)
  ui.log(`${chalk.grey('Path to Entity:')} ${chalk.green(options.pathToEntity.join('.'))}`)
  ui.log(chalk.grey('----------------------------------'))
}

export default async (options: IOptions, { ui, fileDispatcher, cwd }: IContext) => {
  const { graphQLFilePath, force, graphQLUrl, pathToEntity} = options
  displayInfo(options, ui)
  /**
   * Basic info
   */
  const moduleName = getModuleNameByAbsolutePath(graphQLFilePath)
  if (!moduleName) {
    throw new Error('Could not define module')
  }
  const moduleFolder = await getModuleFolder(cwd, moduleName)
  const definitionName = pathToEntity[0]
  const selectionPath = pathToEntity.slice(1)

  /**
   * Document
   */
  const graphQLFileName = path.basename(graphQLFilePath, '.ts')
  const graphQLFileData = await safelyRead(graphQLFilePath)
  const query = await extractSDL(graphQLFileData)
  if (!query) {
    throw new Error(`Could not obtain query from ${graphQLFilePath}`)
  }
  const document = getDocumentNode(graphQLFileData)
  /**
   * Selection
   */
  const selectionsInsideDefinition = getSelectionsOfDefinitionByDefinitionName(definitionName, document.definitions)
  const selectionsByPath = getSelectionsByPath(selectionPath, selectionsInsideDefinition)
  if (!selectionsByPath) {
    throw new Error(`Could not obtain selections from ${pathToEntity}`)
  }
  /**
   * Instrospection schema
   */
  const instrospectionSchema = await fetchInstrospectionSchema(graphQLUrl)
  const instrospectionType = getTypeByPath(selectionPath, instrospectionSchema)
  if (!instrospectionType) {
    throw new Error(`Could not obtain instrospection type from ${pathToEntity}`)
  }
  /**
   * Assemble model
   */
  const model = assembleModel(instrospectionType, selectionsByPath)
  if (!model) {
    throw new Error(`Could not obtain model.`)
  }
  /**
   * Fetch data
   */
  const fetchedData = await requestGraphQL(graphQLUrl, query)
  if (!fetchedData) {
    throw new Error(`Could not obtain data from ${graphQLUrl}`)
  }
  const pathToArray = pathToEntity.slice(1, -1)
  const entityArrayData = R.pathOr([], pathToArray, fetchedData).map((edge: {node: any}) => edge.node)

  /**
   * Render files
   */
  const listComponentFile = await getListComponentFile(moduleFolder, definitionName, model)
  const listStoryFile = await getListStoryFile(moduleFolder, definitionName, entityArrayData)
  const listContainerFile = await getListContainerFile(moduleFolder, definitionName, model)
  const listHocFile = await getListHocFile(moduleFolder, graphQLFileName, definitionName, model)
  const listItemComponentFile = await getListItemComponentFile(moduleFolder, definitionName, model)
  const listItemStoryFile = await getListItemStoryFile(moduleFolder, definitionName, entityArrayData[0])

  /**
   * Dispatch files
   */
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
