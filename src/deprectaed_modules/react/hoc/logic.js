import pkgDir from 'pkg-dir'
import path from 'path'
import { SRC_DIR } from '../../common/constants'
import { MODULES_DIR } from '../../react/react-module/constants'

export const getModulesFolder = async (cwd) => {
  const projectRootFolder = await pkgDir(cwd)
  return projectRootFolder ? path.join(projectRootFolder, SRC_DIR, MODULES_DIR) : null
}

export const getComponentsFolder = async (cwd) => {
  return path.join(getModulesFolder(cwd), 'components')
}

export const getHocsFolder = async (cwd) => {
  return path.join(getModulesFolder(cwd), 'hocs')
}