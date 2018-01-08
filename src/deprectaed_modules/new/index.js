import handleReactNative from './react-native'


export default (yargs) => {
  yargs
    .command('new <platform> [project]', 'Unleash new react-native project', (yargs) => {
      yargs
        .positional('project', {
          type: 'string',
          describe: 'the name of the project',
        }).positional('platform', {
          type: 'string',
          describe: 'The platform',
        })
    }, (argv) => {
      console.log(`Unleashing new ${argv.platform} project: ${argv.project}`)
    })
    
  return yargs
}
