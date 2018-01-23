import { IContext } from './context'
import { Argv } from 'yargs'
import chalk from 'chalk'

export const getErrorHandler = (ctx: IContext) => (fn: (argv: Argv) => Promise<any>) => async (argv: Argv) => {
  try {
    await fn(argv)
  } catch (err) {
    ctx.ui.log(chalk.red(err.message))
    if (err.details) {
      ctx.ui.log(err.details)
    }
  }
}
