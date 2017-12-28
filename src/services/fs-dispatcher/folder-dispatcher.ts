import * as fs from 'fs-extra';
import * as path from 'path';
import { isArray } from 'util';
import { IDispatchableFolder } from './types'

type DispatchableFolderOrFolders = IDispatchableFolder | IDispatchableFolder[]

export interface IDispatchResult {
  created: boolean;
  error: boolean;
  errorDescription?: string;
}

export interface IOptions {
  force: boolean;
}

const createDispatchableFolder = async (folder: IDispatchableFolder, options: IOptions): Promise<any> => {
  if (!options.force && fs.existsSync(folder.path)) {
    throw new Error(`Folder ${folder.path} already exists`)
  }

  if (folder.p) {
    return fs.mkdirp(folder.path)
  }
  return fs.mkdir(folder.path)
}

export default class FolderDispatcher {
  public dispatch = async (folderOrFolders: DispatchableFolderOrFolders, options: IOptions) => {
    if (isArray(folderOrFolders)) {
      return Promise.all(folderOrFolders.map((folder) => createDispatchableFolder(folder, options)))
    }

    return createDispatchableFolder(folderOrFolders, options)
  }
}
