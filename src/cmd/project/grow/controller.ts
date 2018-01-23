import { IContext } from '../../../common/context'
import { changeReactNativeProjectName, installJsDependencies, getCodePushAppName, Platform, createCodePushApp, fetchCodePushKeys, findTemplateFiles, getDispatchableTemplateFiles, checkIfCodePushAppExists, createAppOnAppleStore, createAppleCertificates, changeIcon, uploadToTestFlight, validateSeed, formatErrorDetails, getRemoteNameForUrl } from './logic'
import { safelyRead } from '../../../services/fs/io'
import chalk from 'chalk'
import * as path from 'path'
import { IReactNativeSeed, assocCodePushKeys } from '../seed/logic'
import { DetailedError } from '../../../common/error'
import { schema } from './model'
import * as isUrl from 'is-url'
import * as downloadFile from 'download-file'
import { promisify } from 'util';

export interface IGrowSeed {
  seedPath: string
}

const DEFAULT_REMOTE_NAME = 'template'

export const cloneTemplate = async (templateUrl: string, defaultRemoteName: string, {ui, git}: IContext) => {
  const remotes = await git.getRemotes(true)
  const existingRemote = getRemoteNameForUrl(remotes, templateUrl)
  await git.init()

  if (existingRemote) {
    ui.log(`Using existing remote "${existingRemote}"`)
    await git.pull(existingRemote, 'new-app')
  } else {
    ui.log(`Adding new remote "${defaultRemoteName}"`)
    await git.addRemote(defaultRemoteName, templateUrl)
    await git.pull(defaultRemoteName, 'new-app')
  }
}

export const safelyCreateCodePushApp = async (name: string, platform: Platform, ctx: IContext) => {
  const codePushAppName = getCodePushAppName(name, platform)
  const codePushAppExists = await checkIfCodePushAppExists(codePushAppName)

  if (codePushAppExists) {
    ctx.ui.log(chalk.blueBright(`${codePushAppName} already exists on CodePush`))
  } else {
    ctx.ui.log(chalk.green(`Creating ${codePushAppName} on CodePush `))
    await createCodePushApp(codePushAppName)
  }
  ctx.ui.log(chalk.green(`Obtaining ${codePushAppName} deployment keys`))
  return fetchCodePushKeys(codePushAppName)
}

const download = promisify(downloadFile)

export const growSeed = async ({ seedPath }: IGrowSeed, ctx: IContext) => {
  const seed: IReactNativeSeed = JSON.parse(await safelyRead(seedPath))
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
  await cloneTemplate(seed.template, DEFAULT_REMOTE_NAME, ctx)

  // Change name
  ctx.ui.log(chalk.green(`Changing project name to ${seed.ios.projectName} (${seed.ios.bundleIdentifier}`))
  await changeReactNativeProjectName(seed.ios.projectName, seed.ios.bundleIdentifier)

  //  Create CodePush apps
  const iosCodePushKeys = await safelyCreateCodePushApp(seed.ios.projectName, Platform.iOS, ctx)
  const androidCodePushKeys = await safelyCreateCodePushApp(seed.ios.projectName, Platform.Android, ctx)

  const seedWithCodePush = assocCodePushKeys(seed, iosCodePushKeys, androidCodePushKeys)

  // Templates
  ctx.ui.log(chalk.green(`Rendering templates`))
  const files = await findTemplateFiles(ctx.cwd)
  files.forEach((file) => ctx.ui.log(chalk.grey(`Detected template ${file})`)))

  const dispatchableFiles = await getDispatchableTemplateFiles(files, seedWithCodePush)
  await ctx.fileDispatcher.dispatch(dispatchableFiles)

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
  } else {
    ctx.ui.log(chalk.yellow('Skipping icon change'))
  }

  //  Create app on apple store
  ctx.ui.log(chalk.green('Creating app on Apple Store'))
  await createAppOnAppleStore()

  //  Create certificates
  ctx.ui.log(chalk.green('Creating Apple Certificates'))
  await createAppleCertificates()

  //  Upload to testflight
  ctx.ui.log(chalk.green('Uploading to TestFlight'))
  await uploadToTestFlight()
}
