import { isArray } from 'util'
import { IDispatchableFile } from './types'
import * as fs from 'fs-extra'
import * as path from 'path'

type DispatchableFileOrFiles = IDispatchableFile | IDispatchableFile[]

const createDispatchableFile = async (file: IDispatchableFile) => {
  const folderName = path.dirname(file.path)
  if (!fs.existsSync(folderName)) {
    await fs.mkdirp(folderName)
  }
  return fs.writeFile(file.path, file.content)
}

export default class FileDispatcher {
  public dispatch = async (fileOrFiles: DispatchableFileOrFiles) => {
    if (isArray(fileOrFiles)) {
      return Promise.all(fileOrFiles.map(createDispatchableFile))
    }

    return createDispatchableFile(fileOrFiles)
  };
}
