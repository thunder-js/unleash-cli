import FileDispatcher from '../services/fs-dispatcher/file-dispatcher'
import FolderDispatcher from '../services/fs-dispatcher/folder-dispatcher'

export interface IContext {
  fileDispatcher: FileDispatcher;
  folderDispatcher: FolderDispatcher;
  cwd: string;
  ui: {
    spinner: {
      start: (text: string) => void,
      succeed: (text: string) => void,
    },
  };
}
