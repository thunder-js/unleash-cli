import { IContext } from './context'
import { Argv } from 'yargs'
import chalk from 'chalk'

export const getErrorHandler = (context: IContext) => (fn: (argv: Argv) => Promise<any>) => async (argv: Argv) => {
  try {
    await fn(argv)
  } catch (err) {
    // context.ui.spinner.fail()
    console.log(chalk.red(err.message))
    if (err.details) {
      console.log(err.details)
    }
  }
}
