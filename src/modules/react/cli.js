import { createModule } from './react-module/controller'
import { createComponent } from './component/controller'
import { createList } from './list/controller'

export default yargs => yargs
  .command('module [name]', 'Unleash react module', (subYargs) => {
    subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react module',
    })
  }, argv => createModule(argv.name))
  .command('list [name]', 'Unleash react list', (yargs) => {
    yargs.positional('name', {
      type: 'string',
      describe: 'the name of the react list',
    })
  }, argv => createList(argv.name))
  .command('component [name...]', 'Unleash react component', (yargs) => {
    yargs.positional('name', {
      type: 'string',
      describe: 'the name of the react component',
    })
  }, argv => createComponent(argv.name))
