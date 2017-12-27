import * as fs from 'fs-extra';
import * as path from 'path';
import { IDispatchableFolder } from './types'
import { isArray } from 'util';

type DispatchableFolderOrFolders = IDispatchableFolder | IDispatchableFolder[]

const createDispatchableFolder = (folder: IDispatchableFolder) => {
  if (folder.p) {
    return fs.mkdirp(folder.path)
  }
  return fs.mkdirp(folder.path)
}

export default class FolderDispatcher {
  public dispatch = async (folderOrFolders: DispatchableFolderOrFolders) => {
    if (isArray(folderOrFolders)) {
      return Promise.all(folderOrFolders.map(createDispatchableFolder))
    }
  
    return createDispatchableFolder(folderOrFolders)
  }
}
