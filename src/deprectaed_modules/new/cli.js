import { createRN } from './rn/controller'
import { createRW } from './rw/controller'

export default yargs => yargs
  .command('rn [name]', 'unleash new rn project', (yargs) => {
    yargs.positional('name', {
      type: 'string',
      describe: 'the name of the module',
    })
  }, argv => createRN(argv.name))
  .command('rw [name]', 'unleash new rw project', (yargs) => {
    yargs.positional('name', {
      type: 'string',
      describe: 'the name of the project',
    })
  }, argv => createRW(argv.name))
