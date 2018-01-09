import { IContext } from '../../../common/context'
import { cloneTemplate, changeReactNativeProjectName, installJsDependencies, getCodePushAppName, Platform, createCodePushApp, obtainCodePushKeys, applySubstitution, getXCodeProjName, getScheme, findTemplateFiles, getDispatchableTemplateFiles, checkIfCodePushAppExists } from './logic'
import { safelyRead } from '../../../services/fs/io'
import chalk from 'chalk'

export interface IGrowSeed {
  seedPath: string
}

export interface IReactNativeSeed {
  type: string,
  template: string,
  name: string,
  node: {
    packageName: string,
  },
  facebook: {
    appId: string,
    appDisplayName: string,
  },
  googleMaps: {
    apiKey: string,
  },
  assets: {
    icon: string,
    splash: string,
  },
  ios: {
    displayName: string,
    projectName: string,
    bundleName: string,
    fastlane: {
      itcTeamId: string,
      itcTeamName: string,
      teamName: string,
      teamId: string,
      appleId: string,
      certificatesRepoUrl: string,
      slackUrl: string,
    },
    codePush: {
      staging: string,
      production: string,
    },
  },
  android: {
    displayName: string,
    bundleName: string,
    codePush: {
      staging: string,
      production: string,
    },
  },
}

export const growSeed = async ({ seedPath }: IGrowSeed, ctx: IContext) => {
  // ctx.ui.spinner.start(`Growing seed from ${seedPath}...`)
  const seed: IReactNativeSeed = JSON.parse(await safelyRead(seedPath))

  //  Clone project
  // ctx.ui.log(chalk.green(`Cloning project from ${seed.template}`))
  // await cloneTemplate(seed.template)

  // //  Change name
  // ctx.ui.log(chalk.green(`Changing project name to ${seed.ios.projectName} (${seed.ios.bundleName}`))
  // await changeReactNativeProjectName(seed.ios.projectName, seed.ios.bundleName)

  //  Create CodePush apps
  const androidCodePushAppName = getCodePushAppName(seed.ios.projectName, Platform.Android)
  const androidCodePushAppExists = await checkIfCodePushAppExists(androidCodePushAppName)

  if (androidCodePushAppExists) {
    ctx.ui.log(chalk.blueBright(`${androidCodePushAppName} already exists on CodePush`))
  } else {
    ctx.ui.log(chalk.green(`Creating ${androidCodePushAppName} on CodePush Android`))
    await createCodePushApp(androidCodePushAppName)
  }

  const iosCodePushAppName = getCodePushAppName(seed.ios.projectName, Platform.iOS)
  const iosCodePushAppExists = await checkIfCodePushAppExists(iosCodePushAppName)

  if (iosCodePushAppExists) {
    ctx.ui.log(chalk.blueBright(`${iosCodePushAppName} already exists on CodePush`))
  } else {
    ctx.ui.log(chalk.green(`Creating ${iosCodePushAppName} on CodePush iOS`))
    await createCodePushApp(iosCodePushAppName)
  }

  ctx.ui.log(chalk.green(`Obtaining ${androidCodePushAppName} deployment keys`))
  const androidCodePushKeys = await obtainCodePushKeys(androidCodePushAppName)

  ctx.ui.log(chalk.green(`Obtaining ${iosCodePushAppName} deployment keys`))
  const iosCodePushKeys = await obtainCodePushKeys(iosCodePushAppName)

  const seedWithCodePush = {
    ...seed,
    ios: {
      ...seed.ios,
      codePush: iosCodePushKeys,
    },
    android: {
      ...seed.android,
      codePush: androidCodePushKeys,
    },
  }

  ctx.ui.spinner.start('Rendering templates...')
  const files = await findTemplateFiles(ctx.cwd)

  files.forEach((file) => ctx.ui.log(`Detected template ${file})`))
  const dispatchableFiles = await getDispatchableTemplateFiles(files, seedWithCodePush)
  await ctx.fileDispatcher.dispatch(dispatchableFiles)
  ctx.ui.spinner.succeed()

  //  Install dependencies
  ctx.ui.log(chalk.green('Installing JS dependencies'))
  await installJsDependencies()
}
