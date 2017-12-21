#!/usr/bin/env node
import 'babel-polyfill'

import R from 'ramda'
import yargs from 'yargs'
import attachModuleNew from './modules/new'
import attachModuleReact from './modules/react'

const attachModules = R.compose(
  attachModuleNew,
  attachModuleReact,
)

const baseProgram = yargs
  .usage('$0 <cmd> [args]')
  .help()

const programWithModules = attachModules(baseProgram)

programWithModules.argv
