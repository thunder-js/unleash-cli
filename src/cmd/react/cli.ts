import { Argv } from 'yargs';
import { createModule } from './controller/module';
import { createComponent as createListComponent } from './controller/list/index'
import { createList as createPackList } from './controller/pack/index'
import { getErrorHandler } from '../../common/handle-errors'
import * as R from 'ramda'
import context from '../../common/context'
import * as path from 'path'

const catchErrors = getErrorHandler(context)


const withForce = (argv: Argv): Argv => argv.option('force', {
  alias: 'f',
  type: 'boolean',
  describe: 'should force',
})
const withGraphQLUrl = (argv: Argv): Argv => argv.option('graphql-url', {
  alias: 'g',
  type: 'string',
  describe: 'graphql query endpoint',
})

const withGraphQLDocumentPath = (argv: Argv): Argv => argv.positional('graphql-document-path', {
  alias: 'd',
  type: 'string',
  describe: 'path to graphQL query',
})

const withPathToEntity = (argv: Argv): Argv => argv.option('path-to-entity', {
  alias: 'p',
  type: 'string',
  describe: 'path to entity inside graphQL query',
})

export default (yargs: Argv) => yargs
  .command('pack-list <graphql-file>', 'Unleash react list component', (argv: Argv) => {
    return argv.options({
      'force': {
        alias: 'f',
        type: 'boolean',
        describe: 'should force',
      },
      'graphql-url': {
        alias: 'g',
        type: 'string',
        describe: 'graphql query endpoint',
        demandOption: true,
      },
      'path-to-entity': {
        alias: 'p',
        type: 'string',
        describe: 'path to entity inside graphQL query',
        demandOption: true,
        coerce: (p) => p.split('.'),
      },
    }).positional('graphql-file', {
      type: 'string',
      describe: 'path to graphQL query',
      coerce: (d) => path.resolve(process.cwd(), d),
    })
  },
  catchErrors((argv) => createPackList({
    graphQLFilePath: argv['graphql-file'],
    force: argv.f,
    graphQLUrl: argv.g,
    pathToEntity: argv.p,
  }, context)))
  .command('pack-single <queryPath>', 'Unleash react list component', (subYargs: Argv) => {
    return subYargs.positional('queryPath', {
      type: 'string',
      describe: 'path to graphQL query',
    })
  },
  catchErrors((argv) => createPackList({
    graphQLFilePath: argv['graphql-document-path'],
    force: argv.force,
    graphQLUrl: argv.g,
    pathToEntity: argv.p.split('.'),
  }, context)))
  .command('list <name>', 'Unleash react list component', (subYargs: Argv) => {
    return subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react list component',
    })
  }, catchErrors((argv) => createListComponent(argv.name, context)))
  .command('module <name>', 'Unleash react module', (subYargs: Argv) => {
    return withForce(subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react module',
    }))
  }, catchErrors((argv) => createModule(argv.name, argv.force, context)))
