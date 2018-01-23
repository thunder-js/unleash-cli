import chalk from 'chalk'
import * as find from 'find'
import * as path from 'path'
import { render } from 'ejs'
import { safelyRead } from '../../../services/fs/io'
import { spawnWithLog } from '../../../common/spawn'
import { IReactNativeSeed } from '../seed/logic'

export enum Platform {
  iOS = 'iOS',
  Android = 'Android',
}

export interface ICodePushKeys {
  production: string;
  staging: string;
}

export interface IErrorDetail {
  message: string;
  path: string[];
  type: string;
}

export const formatErrorDetails = (details: IErrorDetail[]) => {
  return details.map((detail) => {
    return chalk.grey(`* ${detail.path.join('.')}: ${detail.message}`)
  }).join('\n')
}

export const validateSeed = (seed: IReactNativeSeed, schema): null | IErrorDetail[]  => {
  const result = schema.validate(seed, {
    abortEarly: false,
  })
  if (result.error) {
    return result.error.details
  }
  return null

}
export const getRemoteNameForUrl = (remotes, remoteUrl) => {
  const existingRemote = remotes.find((remote) => remote.refs.fetch === remoteUrl)
  return existingRemote && existingRemote.name
}

export const changeReactNativeProjectName = async (projectName: string, bundleIdentifier: string) => {
  return spawnWithLog(`react-native-rename ${projectName} -b ${bundleIdentifier}`)
}

export const installJsDependencies = async () => {
  return spawnWithLog('yarn install')
}

export const getCodePushAppName = (name: string, platform: Platform) => {
  return `${name}-${platform}`
}

export const createCodePushApp = async (appName: string) => {
  return spawnWithLog(`code-push app add ${appName} ios react-native`)
}

export const fetchCodePushKeys = async (appName: string): Promise<ICodePushKeys> => {
  const result = JSON.parse(await spawnWithLog(`code-push deployment ls ${appName} -k --format json`, undefined, null, false))

  const productionConfig = result.find((key) => key.name === 'Production')
  const stagingConfig = result.find((key) => key.name === 'Staging')

  return {
    production: productionConfig.key,
    staging: stagingConfig.key,
  }
}

const getFilePathWithoutExtension = (filePath: string, ext: string) => path.join(path.dirname(filePath), path.basename(filePath, ext))

export const findTemplateFiles = (rootPath: string): Promise<string[]> => new Promise((resolve) => {
  find.file(/\.template\.ejs$/, rootPath, (files) => {
    resolve(files)
  })
})

export const getDispatchableTemplateFiles = (files: string[], data: {[key: string]: any}) => {
  return Promise.all(files.map(async (file) => {
    const destFile = getFilePathWithoutExtension(file, '.template.ejs')
    const template = await safelyRead(file)
    const renderedFile = render(template, data)
    return {
      path: destFile,
      content: renderedFile,
    }
  }))
}

export const checkIfCodePushAppExists = async (codePushAppName: string): Promise<boolean> => {
  const apps = JSON.parse(await spawnWithLog(`code-push app ls --format json`, undefined, null, false))
  return !!apps.find((app) => app.name === codePushAppName)
}

export const changeIcon = async (iconPath: string) => {
  await spawnWithLog(`rntb icon ${iconPath}`)
}

export const createAppOnAppleStore = async () => {
  await spawnWithLog('bundle exec fastlane publishStore', {
    cwd: 'ios',
  })
}

export const createAppleCertificates = async () => {
  await spawnWithLog('bundle exec fastlane createCertificates', {
    cwd: 'ios',
  })
}

export const uploadToTestFlight = async () => {
  await spawnWithLog('bundle exec fastlane beta', {
    cwd: 'ios',
  })
}
