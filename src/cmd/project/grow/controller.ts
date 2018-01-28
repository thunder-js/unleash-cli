import { IContext } from '../../../common/context'
import {changeReactNativeProjectName,
  installJsDependencies,
  createCodePushApp,
  fetchCodePushKeys,
  findTemplateFiles,
  getDispatchableTemplateFiles,
  checkIfCodePushAppExists,
  createAppOnAppleStore,
  createAppleCertificates,
  changeIcon,
  uploadToTestFlight,
  validateSeed,
  formatErrorDetails,
} from './logic'
import { safelyRead } from '../../../services/fs/io'
import chalk from 'chalk'
import * as path from 'path'
import { IReactNativeSeed, assocCodePushKeys } from '../seed/logic'
import { DetailedError } from '../../../common/error'
import { schema } from './model'
import * as isUrl from 'is-url'
import * as downloadFile from 'download-file'
import * as mv from 'mv'
import { promisify } from 'util';
import * as fs from 'fs-extra'

export interface IGrowSeed {
  seedPath: string
}

export const cloneWithTag = async (repoUrl: string, tag: string, { git }: IContext) => {
  await git.clone(repoUrl, '.')
  await git.checkout(tag)
}

export const startNewRepo = async ({ git }: IContext) => {
  await fs.remove('.git')
  await git.init()
}

export const moveWithRecover = async (from: string, to: string) => {
  await fs.move(from, to)
  return () => fs.move(to, from)
}

export const addAllAndCommit = async (msg: string, { git }: IContext) => {
  await git.add('.')
  return git.commit(msg)
}
const getSeedTmpPath = (): string => {
  return path.join('/', 'tmp', 'seed.json')
}

export const safelyCreateCodePushApp = async (name: string, ctx: IContext) => {
  const codePushAppExists = await checkIfCodePushAppExists(name)

  if (codePushAppExists) {
    ctx.ui.log(chalk.blueBright(`${name} already exists on CodePush`))
  } else {
    ctx.ui.log(chalk.green(`Creating ${name} on CodePush `))
    await createCodePushApp(name)
  }
  ctx.ui.log(chalk.green(`Obtaining ${name} deployment keys`))
  return fetchCodePushKeys(name)
}

const download = promisify(downloadFile)

export const growSeed = async ({ seedPath }: IGrowSeed, ctx: IContext) => {
  const seed: IReactNativeSeed = JSON.parse(await safelyRead(seedPath))

  //  Check if there is an exiting repo on the current directory
  //  Since we will start a new repo, it could be destructive
  const isRepo = await ctx.git.checkIsRepo()
  if (isRepo) {
    throw new DetailedError({
      message: 'Existing repo',
      details: `Remove the existing repo in ${ctx.cwd}`,
    })
  }

  // Validate seed
  const schemaErrors = validateSeed(seed, schema)
  if (schemaErrors) {
    throw new DetailedError({
      message: 'Invalid seed',
      details: formatErrorDetails(schemaErrors),
    })
  }

  //  Clone project
  ctx.ui.log(chalk.green(`Cloning project from ${seed.template}`))
  const moveSeedBack = await moveWithRecover(seedPath, getSeedTmpPath())
  await cloneWithTag(seed.template, seed.tag, ctx)
  await moveSeedBack()
  await startNewRepo(ctx)
  await addAllAndCommit(`Cloned remote template with tag #${seed.tag}`, ctx)

  // Change name
  ctx.ui.log(chalk.green(`Changing project name to ${seed.ios.projectName} (${seed.ios.bundleIdentifier}`))
  await changeReactNativeProjectName(seed.ios.projectName, seed.ios.bundleIdentifier)
  await addAllAndCommit(`Renamed project to ${seed.ios.projectName} (${seed.ios.bundleIdentifier}`, ctx)

  //  Create CodePush apps
  const iosCodePushKeys = await safelyCreateCodePushApp(seed.ios.codePush.name, ctx)
  const androidCodePushKeys = await safelyCreateCodePushApp(seed.android.codePush.name, ctx)
  const seedWithCodePush = assocCodePushKeys(seed, iosCodePushKeys, androidCodePushKeys)

  // Templates
  ctx.ui.log(chalk.green(`Rendering templates`))
  const files = await findTemplateFiles(ctx.cwd)
  files.forEach((file) => ctx.ui.log(chalk.grey(`Detected template ${file})`)))
  const dispatchableFiles = await getDispatchableTemplateFiles(files, seedWithCodePush)
  await ctx.fileDispatcher.dispatch(dispatchableFiles)
  await addAllAndCommit('Changed template files to match new project', ctx)

  //  Install dependencies
  ctx.ui.log(chalk.green('Installing JS dependencies'))
  await installJsDependencies()

  //  Change Icon
  if (seed.assets && seed.assets.icon) {
    const iconUri = seed.assets.icon
    if (isUrl(iconUri)) {
      ctx.ui.log(`Downloading icon from ${iconUri}`)
      await download(seed.assets.icon, {
        directory: path.resolve(ctx.cwd, 'temp'),
        filename: 'icon.png',
      })
      const iconPath = path.resolve(ctx.cwd, 'temp', 'icon.png')
      ctx.ui.log(chalk.green('Changing icon'))
      await changeIcon(iconPath)
    } else {
      const iconPath = path.resolve(ctx.cwd, seedWithCodePush.assets.icon)
      ctx.ui.log(chalk.green('Changing icon'))
      await changeIcon(iconPath)
    }
    await addAllAndCommit('Changed project icon', ctx)
  } else {
    ctx.ui.log(chalk.yellow('Skipping icon change'))
  }

  //  Create app on apple store
  ctx.ui.log(chalk.green('Creating app on Apple Store'))
  // await createAppOnAppleStore()

  //  Create certificates
  ctx.ui.log(chalk.green('Creating Apple Certificates'))
  // await createAppleCertificates()

  //  Upload to testflight
  ctx.ui.log(chalk.green('Uploading to TestFlight'))
  // await uploadToTestFlight()
}
