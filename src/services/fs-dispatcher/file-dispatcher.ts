import { isArray } from 'util'
import { IDispatchableFile } from './types'
import * as fs from 'fs-extra'

type DispatchableFileOrFiles = IDispatchableFile | IDispatchableFile[]

const createDispatchableFile = (file: IDispatchableFile) => fs.writeFile(file.path, file.content)

export default class FileDispatcher {
  public dispatch = async (fileOrFiles: DispatchableFileOrFiles) => {
    if (isArray(fileOrFiles)) {
      return Promise.all(fileOrFiles.map(createDispatchableFile))
    }

    return fs.writeFile(fileOrFiles.path, fileOrFiles.content)
  };
}
