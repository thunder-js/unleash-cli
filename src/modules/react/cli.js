import { createModule } from './react-module/controller'
import { createComponent } from './component/controller'
import { createList } from './list/controller'
import { createHoc } from './hoc/controller'

export default yargs => yargs
  .command('module [name]', 'Unleash react module', (subYargs) => {
    subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react module',
    })
  }, argv => createModule(argv.name))
  .command('list [name]', 'Unleash react list', (subYargs) => {
    subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react list',
    })
  }, (argv) => {
    console.log(argv)
    return createList(argv.name)
  })
  .command('hoc [queryPath]', 'Unleash react hoc', (subYargs) => {
    subYargs.positional('queryPath', {
      type: 'string',
      describe: 'the queryPath of the react list',
    })
  }, (argv) => {
    return createHoc(argv.queryPath)
  })
  .command('component [name...]', 'Unleash react component', (subYargs) => {
    subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react component',
    })
  }, argv => createComponent(argv.name))
