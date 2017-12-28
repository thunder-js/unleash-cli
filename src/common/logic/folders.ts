import * as path from 'path';
import * as pkgDir from 'pkg-dir'
import { FolderNames, FileNames } from '../constants'

export const getProjectRoot = async (cwd: string): Promise<string> => pkgDir(cwd)
export const getModulesFolder = async (cwd: string): Promise<string> => path.join(await getProjectRoot(cwd), FolderNames.src, FolderNames.modules);
export const getModuleFolder = async (cwd: string, moduleName: string): Promise<string> => path.join(await getModulesFolder(cwd), moduleName);

export const getModuleNameByAbsolutePath = (absolutePath: string): string | null => {
  const matches = absolutePath.match(/src\/modules\/(.*?)\//)
  if (matches) {
    return matches[1]
  }
  return null
}

export const getStoriesFilePath = async (cwd) => {
  const projectRootFolder = await getProjectRoot(cwd)
  return projectRootFolder ? path.join(projectRootFolder, FolderNames.src, FileNames.stories) : null
}
