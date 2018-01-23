import FileDispatcher from '../services/fs-dispatcher/file-dispatcher'
import FolderDispatcher from '../services/fs-dispatcher/folder-dispatcher'
import UI from '../services/ui/ui'
import * as simpleGit from 'simple-git/promise'

export interface IContext {
  fileDispatcher: FileDispatcher;
  folderDispatcher: FolderDispatcher;
  cwd: string;
  ui: UI;
  git: any;
}

const context: IContext = {
  cwd: process.cwd(),
  git: simpleGit(process.cwd()),
  fileDispatcher: new FileDispatcher(),
  folderDispatcher: new FolderDispatcher(),
  ui: new UI(),
}

export default context
