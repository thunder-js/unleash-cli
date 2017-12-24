import { getReactModulesFolder, createFolders } from './logic'
import { spinner } from '../../common/ui'

export const createModule = async (name) => {
  spinner.start(`Creating module ${name}...`)
  const modulesFolder = await getReactModulesFolder(process.cwd())
  await createFolders(modulesFolder, name)
  spinner.succeed()
}
