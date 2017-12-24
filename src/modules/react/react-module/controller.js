import { getReactModulesFolder, getFoldersPaths } from './logic'
import { createFolders } from './diplomat'
import { spinner } from '../../common/ui'

export const createModule = async (name) => {
  spinner.start(`Creating module ${name}...`)
  const modulesFolder = await getReactModulesFolder(process.cwd())
  if (!modulesFolder) {
    spinner.fail('Not in project folder.')
    return process.exit(1)
  }
  const foldersPaths = getFoldersPaths(modulesFolder, name)
  await createFolders(foldersPaths)
  spinner.succeed()
}
