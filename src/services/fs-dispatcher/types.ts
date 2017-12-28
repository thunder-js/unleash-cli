export interface IDispatchable {
  path: string;
}
export interface IDispatchableFolder extends IDispatchable {
  p?: boolean;
}
export interface IDispatchableFile extends IDispatchable {
  content: string;
}

export interface IDispatcher {

}

export interface IFolderDispatcher extends IDispatcher {
  dispatch: (dir: IDispatchableFolder | IDispatchableFolder[]) => Promise<IDispatchableFolder>
}
export interface IFileDispatcher extends IDispatcher {
  dispatch: (file: IDispatchableFile | IDispatchableFile[]) => Promise<IDispatchableFile>
}
