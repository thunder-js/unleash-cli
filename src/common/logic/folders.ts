import * as path from 'path';
import * as pkgDir from 'pkg-dir'
import { FolderNames } from '../constants';

export const getProjectRoot = (cwd: string): string => pkgDir(cwd)
export const getModulesFolder = (cwd: string): string => path.join(getProjectRoot(cwd), FolderNames.src, FolderNames.modules);
export const getModuleFolder = (cwd: string, moduleName: string): string => path.join(getModulesFolder(cwd), moduleName);
