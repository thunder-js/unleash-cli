import { Argv } from 'yargs';
import { createSeed } from './seed/controller'
import { getErrorHandler } from '../../common/handle-errors'
import context from '../../common/context'
import { externalTypeToInternal } from './seed/adapter'
import * as path from 'path'
import { growSeed } from './grow/controller'

const catchErrors = getErrorHandler(context)

export default (yargs: Argv) => yargs
  .command('seed <type>', 'Unleash seed', (argv: Argv) => {
    return argv.options('name', {
      alias: 'n',
      type: 'string',
      describe: 'Project name',
    })
    .positional('type', {
      type: 'string',
      describe: 'react-native | react-web |',
      coerce: (d) => externalTypeToInternal(d),
    })
  },
  catchErrors((argv) => createSeed({
    type: argv.type,
    name: argv.name,
  }, context)))
  .command('grow <seedPath>', 'Grow the seed', (argv: Argv) => {
    return argv.positional('seedPath', {
      type: 'string',
      coerce: (seedRelativePath) => path.resolve(process.cwd(), seedRelativePath),
    })
  },
  catchErrors((argv) => growSeed({
    seedPath: argv.seedPath,
  }, context)))
