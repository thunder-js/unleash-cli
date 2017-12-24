import pkgDir from 'pkg-dir'
import path from 'path'
import fs from 'fs-extra'
import { SRC_DIR } from '../../common/constants'
import { MODULES_DIR } from './constants'

export const getReactModulesFolder = async (cwd) => {
  const projectRootFolder = await pkgDir(cwd)
  return projectRootFolder ? path.join(projectRootFolder, SRC_DIR, MODULES_DIR) : null
}

export const getFoldersPaths = (modulesFolder, moduleName) => {
  const folders = ['components', 'containers', 'hocs', 'logic', 'queries', 'mutations']
  return folders.map(folder => path.join(modulesFolder, moduleName, folder))
}
