#!/usr/bin/env node
import * as yargs from 'yargs'
import reactCLI from './cmd/react/cli'
import projectCLI from './cmd/project/cli'
import chalk from 'chalk'
import { DetailedError } from './common/error'

yargs
  .command('project', 'create project things', projectCLI)
  .command('react', 'create react things', reactCLI)
  .fail((_, err: DetailedError) => {
    console.log(chalk.red(err.message))
    console.log(chalk.grey(err.details))
  })
  .help()
  .parse()
