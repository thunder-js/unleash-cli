import * as path from 'path';
import { FolderNames } from '../../../../common/constants';
import { IDispatchableFolder } from '../../model/dispatchable-file'

export const getNewModuleFolders = (moduleDir: string): IDispatchableFolder[] => {
  return [{
    path: path.join(moduleDir, FolderNames.components),
    p: true,
  }, {
    path: path.join(moduleDir, FolderNames.containers),
    p: true,
  }, {
    path: path.join(moduleDir, FolderNames.queries),
    p: true,
  }, {
    path: path.join(moduleDir, FolderNames.mutations),
    p: true,
  }, {
    path: path.join(moduleDir, FolderNames.logic),
    p: true,
  }, {
    path: path.join(moduleDir, FolderNames.hocs),
    p: true,
  }];
};
