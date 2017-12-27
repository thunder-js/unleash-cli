import { Argv } from 'yargs';
import { createModule } from './controller/module';
import { createComponent as createListComponent } from './controller/list/index'
import { createList as createPackList } from './controller/pack/index'
import { getErrorHandler } from '../../common/handle-errors'
import context from '../../common/context'

const catchErrors = getErrorHandler(context)

export default (yargs: Argv) => yargs
  .command('pack list <queryPath>', 'Unleash react list component', (subYargs: Argv) => {
    return subYargs.positional('queryPath', {
      type: 'string',
      describe: 'path to graphQL query',
    })
    .option('entityPath', {
      type: 'string',
      describe: 'path to entity inside graphQL query',
    })
  }, catchErrors((argv) => createPackList(argv.name, context)))
  .command('pack single <queryPath>', 'Unleash react list component', (subYargs: Argv) => {
    return subYargs.positional('queryPath', {
      type: 'string',
      describe: 'path to graphQL query',
    })
  }, catchErrors((argv) => createPackList(argv.name, context)))
  .command('list <name>', 'Unleash react list component', (subYargs: Argv) => {
    return subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react list component',
    })
  }, catchErrors((argv) => createListComponent(argv.name, context)))
  .command('module <name>', 'Unleash react module', (subYargs: Argv) => {
    return subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react module',
    })
  }, catchErrors((argv) => createModule(argv.name, context)))
