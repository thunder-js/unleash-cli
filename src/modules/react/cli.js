import { createModule } from './react-module/controller'
import { createComponent } from './component/controller'
import { createListPack } from './list/controller'
import { createHoc } from './hoc/controller'
import { createSinglePack } from './single/controller';

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
      .option('graphql-url', {
        alias: 'u',
      })
      .option('search-path', {
        alias: 'p',
      })
  }, argv => createListPack(argv.name, argv.u, argv.p))
  .command('single [queryPath]', 'Unleash react single pack', (subYargs) => {
    subYargs.positional('queryPath', {
      type: 'string',
      describe: 'the path to the query',
    })
  }, argv => createSinglePack(argv.queryPath))
  .command('hoc [queryPath]', 'Unleash react hoc', (subYargs) => {
    subYargs.positional('queryPath', {
      type: 'string',
      describe: 'the queryPath of the react list',
    })
      .option('graphql-url', {
        alias: 'u',
      })
      .option('search-path', {
        alias: 'p',
      })
  }, argv => createHoc(argv.queryPath, argv.u, argv.p))
  .command('component [name...]', 'Unleash react component', (subYargs) => {
    subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react component',
    })
  }, argv => createComponent(argv.name))
