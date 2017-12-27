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
