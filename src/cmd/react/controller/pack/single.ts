import { IContext } from '../../../../common/context'
import chalk from 'chalk'
import { getModuleNameByAbsolutePath, getModuleFolder, getStoriesFilePath } from '../../../../common/logic/folders'
import { safelyRead } from '../../../../services/fs/io'
import { extractSDL, getDocumentNode } from '../../../../common/graphql/info'
import { getSelectionsOfDefinitionByDefinitionName, getSelectionsByPath } from '../../../../common/graphql/document'
import { fetchInstrospectionSchema } from '../../../../services/graphql-endpoint/instrospection'
import { getTypeByPath } from '../../../../common/graphql/instrospection-schema'
import * as path from 'path'
import { assembleModel } from '../../../../common/graphql/model'
import { requestGraphQL } from '../../../../services/graphql-endpoint/query';
import * as R from 'ramda';
import { getSingleComponentFileName, getStoriesToAppend, isStoryAlreadyRegistered } from './logic'
import { getSingleComponentFile, getSingleStoryFile, getSingleHocFile, getSingleContainerFile } from './logic-single';

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
  const [ definitionName, ...selectionPath ] = pathToEntity

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
  const fetchedData = await requestGraphQL(graphQLUrl, query, {
    id: '1234',
  })
  if (!fetchedData) {
    throw new Error(`Could not obtain data from ${graphQLUrl}`)
  }
  const pathToData = pathToEntity.slice(1)
  const singleData = R.pathOr([], pathToData, fetchedData)

  /**
   * Stories
   */
  const storiesFilePath = await getStoriesFilePath(process.cwd())
  const storiesFileContent = await safelyRead(storiesFilePath)
  const singleComponentFileName = getSingleComponentFileName(definitionName)
  const storiesToAppend = getStoriesToAppend(moduleName, [singleComponentFileName], storiesFileContent)
  const storyAlreadyAppended = isStoryAlreadyRegistered(moduleName, singleComponentFileName, storiesFileContent)

  /**
   * Render files
   */
  const singleComponentFile = await getSingleComponentFile(moduleFolder, definitionName, model)
  const singleStoryFile = await getSingleStoryFile(moduleFolder, definitionName, singleData)
  const singleHoc = await getSingleHocFile(moduleFolder, definitionName, model, selectionPath)
  const singleContainer = await getSingleContainerFile(moduleFolder, definitionName,
  )
  /**
   * Dispatch files
   */
  ui.spinner.start('[ Single-Pack ] Creating Component ...')
  await fileDispatcher.dispatch(singleComponentFile)
  ui.spinner.succeed()

  ui.spinner.start('[ Single-Pack ] Creating Story ...')
  await fileDispatcher.dispatch(singleStoryFile)
  ui.spinner.succeed()

  ui.spinner.start('[ Single-Pack ] Creating HOC ...')
  await fileDispatcher.dispatch(singleHoc)
  ui.spinner.succeed()

  ui.spinner.start('[ Single-Pack ] Creating Container ...')
  await fileDispatcher.dispatch(singleContainer)
  ui.spinner.succeed()
}
