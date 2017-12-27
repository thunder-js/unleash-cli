import * as path from 'path';
import * as pkgDir from 'pkg-dir'
import { FolderNames } from '../constants';

export const getProjectRoot = async (cwd: string): Promise<string> => pkgDir(cwd)
export const getModulesFolder = async (cwd: string): Promise<string> => path.join(await getProjectRoot(cwd), FolderNames.src, FolderNames.modules);
export const getModuleFolder = async (cwd: string, moduleName: string): Promise<string> => path.join(await getModulesFolder(cwd), moduleName);
