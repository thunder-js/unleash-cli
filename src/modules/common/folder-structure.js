import path from 'path'
import pkgDir from 'pkg-dir'
import { SRC_DIR, MODULES_DIR } from './constants'

export const getModuleName = (queryPath) => {
  const folders = path.resolve(process.cwd(), queryPath, '../../').split('/')
  return folders[folders.length - 1]
}

export const getModulesFolder = async (cwd) => {
  const projectRootFolder = await pkgDir(cwd)
  return projectRootFolder ? path.join(projectRootFolder, SRC_DIR, MODULES_DIR) : null
}

export const Folders = {
  components: 'components',
  hocs: 'hocs',
  containers: 'containers',
  queries: 'queries',
  mutations: 'mutations',
  logic: 'logic',
}

export const getStoriesFilePath = async (cwd) => {
  const projectRootFolder = await pkgDir(cwd)
  return projectRootFolder ? path.join(projectRootFolder, SRC_DIR, 'stories.js') : null
}
