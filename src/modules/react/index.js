import handleComponent from './component';
import handleList from './list';


export default (yargs) => {
  yargs
    .command('react module [name]', 'Unleash new react module', (yargs) => {
      yargs.positional('project', {
        type: 'string',
        describe: 'the name of the module',
      })
    }, (argv) => {
      console.log(`Unleashing react module: ${argv.name}`)
    })
    .command('react list [name]', 'Unleash new react list', (yargs) => {
      yargs.positional('project', {
        type: 'string',
        describe: 'the name of the react list',
      })
    }, (argv) => {
      console.log(`Unleashing react list: ${argv.name}`)
    })
    .command('react component [name]', 'Unleash new react component', (yargs) => {
      yargs.positional('name', {
        type: 'string',
        describe: 'the name of the react component',
      })
    }, (argv) => {
      console.log(`Unleashing react component: ${argv.name}`)
    })

  return yargs
}

