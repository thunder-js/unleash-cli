import { IContext } from '../../../../common/context';
import { getModuleFolder } from '../../../../common/logic/folders';
import { getNewModuleFolders } from './logic';
import { IDispatchableFolder } from '../../model/dispatchable-file';

export default async (moduleName: string, { folderDispatcher, cwd, ui }: IContext) => {
  ui.spinner.start(`[ Module ] - Creating module ${moduleName}`)

  const moduleFolder: string = await getModuleFolder(cwd, moduleName);
  const moduleInnerFolders: IDispatchableFolder[] = getNewModuleFolders(moduleFolder);
  await folderDispatcher.dispatch(moduleInnerFolders);

  ui.spinner.succeed(`[ Module ] - ${moduleName} created successfully!`);
};
