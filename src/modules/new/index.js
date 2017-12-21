import handleReactNative from './react-native'


export default (yargs) => {
  yargs
    .command('new react-native [project]', 'Unleash new react-native project', (yargs) => {
      yargs.positional('project', {
        type: 'string',
        describe: 'the name of the react-native project',
      })
    }, (argv) => {
      console.log(`Unleashing new react-native project: ${argv.project}`)
    })
    .command('new react-web [project]', 'Unleash new react-web project', (yargs) => {
      yargs.positional('project', {
        type: 'string',
        describe: 'the name of the react-native project',
      })
    }, (argv) => {
      console.log(`Unleashing new react-web project: ${argv.project}`)
    })

  return yargs
}
