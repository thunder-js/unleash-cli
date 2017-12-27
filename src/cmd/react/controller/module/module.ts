import { IContext } from '../../../../common/context';
import { getModuleFolder } from '../../../../common/logic/folders';
import { getNewModuleFolders } from './logic';

export default async (moduleName: string, { folderDispatcher, cwd, ui }: IContext) => {
  ui.spinner.start(`Creating module ${moduleName}`);

  const moduleFolder = getModuleFolder(cwd, moduleName);
  const moduleInnerFolders = getNewModuleFolders(moduleFolder);

  await folderDispatcher.dispatch(moduleInnerFolders);

  ui.spinner.succeed(`Module ${moduleName} created successfully!`);
};
