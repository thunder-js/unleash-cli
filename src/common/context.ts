import FileDispatcher from '../services/fs-dispatcher/file-dispatcher'
import FolderDispatcher from '../services/fs-dispatcher/folder-dispatcher'
import UI from '../services/ui/ui'

export interface IContext {
  fileDispatcher: FileDispatcher;
  folderDispatcher: FolderDispatcher;
  cwd: string;
  ui: UI;
}

const context: IContext = {
  cwd: process.cwd(),
  fileDispatcher: new FileDispatcher(),
  folderDispatcher: new FolderDispatcher(),
  ui: new UI(),
}

export default context
