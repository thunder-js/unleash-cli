import { Argv, Arguments } from 'yargs'
import { createModule } from './controller/module';
import { createComponent as createListComponent } from './controller/list/index'
import { createList as createPackList, createSingle as createPackSingle } from './controller/pack/index'
// import { getErrorHandler } from '../../common/handle-errors'
import context from '../../common/context'
import * as path from 'path'

// const catchErrors = getErrorHandler(context)

const withForce = (argv: Argv): Argv => argv.option('force', {
  alias: 'f',
  type: 'boolean',
  describe: 'should force',
})
// const withGraphQLUrl = (argv: Argv): Argv => argv.option('graphql-url', {
//   alias: 'g',
//   type: 'string',
//   describe: 'graphql query endpoint',
// })

// const withGraphQLDocumentPath = (argv: Argv): Argv => argv.positional('graphql-document-path', {
//   alias: 'd',
//   type: 'string',
//   describe: 'path to graphQL query',
// })

// const withPathToEntity = (argv: Argv): Argv => argv.option('path-to-entity', {
//   alias: 'p',
//   type: 'string',
//   describe: 'path to entity inside graphQL query',
// })

export default (yargs: Argv) => yargs
  .command('pack-list <graphql-file>', 'Unleash react list component', (args: Argv) => {
    return args.options({
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
  async (args: Arguments) => {
    await createPackList({
      graphQLFilePath: args['graphql-file'],
      force: args.f,
      graphQLUrl: args.g,
      pathToEntity: args.p,
    }, context)
  })
  .command('pack-single <graphql-file>', 'Unleash react single pack', (subYargs: Argv) => {
    return subYargs.options({
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
  async (args: Arguments) => {
    await createPackSingle({
      graphQLFilePath: args['graphql-file'],
      force: args.f,
      graphQLUrl: args.g,
      pathToEntity: args.p,
    }, context)
  })
  .command('list <name>', 'Unleash react list component', (subYargs: Argv) => {
    return subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react list component',
    })
  }, async (args: Arguments) => {
    await createListComponent(args.name, context)
  })
  .command('module <name>', 'Unleash react module', (subYargs: Argv) => {
    return withForce(subYargs.positional('name', {
      type: 'string',
      describe: 'the name of the react module',
    }))
  }, async (args: Arguments) => {
    await createModule(args.name, args.force, context)
  })
