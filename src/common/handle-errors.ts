import { IContext } from './context'
import { Argv } from 'yargs'

export const getErrorHandler = (context: IContext) => (fn: (argv: Argv) => Promise<any>) => async (argv: Argv) => {
  try {
    await fn(argv)
  } catch (err) {
    context.ui.spinner.fail()
    console.log(err.toString())
  }
}
