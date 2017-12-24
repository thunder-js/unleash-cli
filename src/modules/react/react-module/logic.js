import pkgDir from 'pkg-dir'
import path from 'path'
import fs from 'fs-extra'
import { SRC_DIR } from '../../common/constants'
import { MODULES_DIR } from './constants'

export const getReactModulesFolder = async (cwd) => {
  const projectRootFolder = await pkgDir(cwd)
  return projectRootFolder ? path.join(projectRootFolder, SRC_DIR, MODULES_DIR) : null
}

export const createFolders = async (modulesFolder, moduleName) => {
  const folders = ['components', 'containers', 'hocs', 'logic', 'queries', 'mutations']
  const mkdirPromises = folders.map(folder => fs.mkdirp(path.join(modulesFolder, moduleName, folder)))
  await Promise.all(mkdirPromises)
}