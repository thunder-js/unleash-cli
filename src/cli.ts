#!/usr/bin/env node
import * as yargs from 'yargs'
import reactCLI from './cmd/react/cli'

yargs
  .command('react', 'create react things', reactCLI)
  .help()
  .parse()
