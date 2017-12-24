import { getReactModulesFolder, createFolders } from './logic'
import { spinner } from '../../common/ui'

export const createModule = async (name) => {
  spinner.start(`Creating module ${name}...`)
  const modulesFolder = await getReactModulesFolder(process.cwd())
  if (!modulesFolder) {
    spinner.fail('Not in project folder.')
    return process.exit(1)
  }
  await createFolders(modulesFolder, name)
  spinner.succeed()
}
