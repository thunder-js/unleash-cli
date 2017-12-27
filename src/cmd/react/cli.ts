import { Argv } from 'yargs';
import { createModule } from './controller/module';
import { createComponent as createListComponent } from './controller/list/index'
import { createList as createPackList } from './controller/pack/index'
import { IContext } from '../../common/context'
import { FileDispatcher, FolderDispatcher } from '../../services/fs-dispatcher'
import UI from '../../services/ui/ui'

const context: IContext = {
  cwd: process.cwd(),
  fileDispatcher: new FileDispatcher(),
  folderDispatcher: new FolderDispatcher(),
  ui: new UI(),
}

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
  }, (argv) => createPackList(argv.name, context))
  .command('pack single <queryPath>', 'Unleash react list component', (subYargs: Argv) => {
    return subYargs.positional('queryPath', {
      type: 'string',
      describe: 'path to graphQL query',
    })
  }, (argv) => createPackList(argv.name, context))
  .command('list <name>', 'Unleash react list component', (subYargs: Argv) => {
    return subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react list component',
    })
  }, (argv) => createListComponent(argv.name, context))
  .command('module <name>', 'Unleash react module', (subYargs: Argv) => {
    return subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react module',
    })
  }, (argv) => createModule(argv.name, context))
  