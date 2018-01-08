#!/usr/bin/env node
import * as yargs from 'yargs'
import reactCLI from './cmd/react/cli'
import projectCLI from './cmd/project/cli'

yargs
  .command('react', 'create react things', reactCLI)
  .command('project', 'create project things', projectCLI)
  .help()
  .parse()
