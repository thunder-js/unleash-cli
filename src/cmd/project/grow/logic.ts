import { exec } from 'child-process-promise'
import chalk from 'chalk'
import { spawn } from 'child_process';
import * as find from 'find'
import * as path from 'path'
import { render } from 'ejs'
import { safelyRead } from '../../../services/fs/io'

const spawnWithLog = (cmd: string, printStdout = true, printStderr = true): Promise<string> => new Promise((resolve, reject) => {
  console.log(chalk.yellow(cmd))
  const [program, ...a] = cmd.split(' ')
  const childProcess = spawn(program, a)
  let stdoutData = ''
  let stderrData = ''

  childProcess.stdout.on('data', (data) => {
    stdoutData = stdoutData + data.toString()
    if (printStdout) {
      console.log(chalk.grey(data.toString()))
    }
  })
  childProcess.stderr.on('data', (data) => {
    stderrData = stderrData + data.toString()
    if (printStderr) {
      console.log(chalk.grey(data.toString()))
    }
  })

  childProcess.on('close', (code) => {
    if (code === 0) {
      return resolve(stdoutData)
    }
    reject(stderrData)
  })
})

export const cleanDirectory = async () => {
  await spawnWithLog('rm -rf .git')
  await spawnWithLog ('find . ! -name seed.json -delete')
}

export const cloneTemplate = async (templateUrl: string) => {
  await spawnWithLog('git init .')
  await spawnWithLog(`git remote add template ${templateUrl}`)
  await spawnWithLog('git pull template new-app')
}

export const changeReactNativeProjectName = async (projectName: string, bundleIdentifier: string) => {
  return spawnWithLog(`react-native-rename ${projectName} -b ${bundleIdentifier}`)
}

export const installJsDependencies = async () => {
  return spawnWithLog('yarn install')
}

export enum Platform {
  iOS = 'iOS',
  Android = 'Android',
}
export const getCodePushAppName = (name: string, platform: Platform) => {
  return `${name}-${platform}`
}

export const createCodePushApp = async (appName: string) => {
  return spawnWithLog(`code-push app add ${appName} ios react-native`)
}

export interface ICodePushKeys {
  production: string;
  staging: string;
}
export const obtainCodePushKeys = async (appName: string): Promise<ICodePushKeys> => {
  const result = JSON.parse(await spawnWithLog(`code-push deployment ls ${appName} -k --format json`, false))

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

export const checkIfCodePushAppExists = async (codePushAppName: string): boolean => {
  const apps = JSON.parse(await spawnWithLog(`code-push app ls --format json`, false))
  return !! apps.find((app) => app.name === codePushAppName)
}
