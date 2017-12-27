import * as path from 'path';
import { FolderNames } from '../../../../common/constants';
import { IDispatchableFolder } from './module';

export const getNewModuleFolders = (moduleDir: string): IDispatchableFolder[] => {
  return [{
    path: path.join(moduleDir, FolderNames.components),
  }, {
    path: path.join(moduleDir, FolderNames.containers),
  }, {
    path: path.join(moduleDir, FolderNames.queries),
  }, {
    path: path.join(moduleDir, FolderNames.mutations),
  }, {
    path: path.join(moduleDir, FolderNames.logic),
  }, {
    path: path.join(moduleDir, FolderNames.hocs),
  }];
};
