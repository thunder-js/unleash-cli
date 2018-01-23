import { spawn, SpawnOptions } from 'child_process'
import chalk from 'chalk'

export const spawnWithLog = (cmd: string, options?: SpawnOptions, printStdout = true, printStderr = true): Promise<string> => new Promise((resolve, reject) => {
  console.log(chalk.yellow(cmd))
  const [program, ...a] = cmd.split(' ')
  const childProcess = spawn(program, a, options)
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
    reject({
      message: 'Spawn failed',
      details: stderrData,
    })
  })
})
