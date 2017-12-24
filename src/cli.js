#!/usr/bin/env node
import 'babel-polyfill'
import yargs from 'yargs'
import newCLI from './modules/new/cli'
import reactCLI from './modules/react/cli'

yargs
  // .usage('$0 <cmd> [args]')
  .command('new', 'create a new [rn|rw] project', newCLI)
  .command('react', 'create react things', reactCLI)
  .help()
  .wrap(null)
  .parse()
