import path from 'path'
import fs from 'fs-extra'
import { render } from '../../common/template'
import { getComponentFileName, getComponentFolderName, getStoryFileName } from './logic'
import { spinner } from '../../common/ui'

const Templates = {
  component: 'component',
  componentStory: 'component-story',
}
export const createComponent = async (names) => {
  if (!names || names.length === 0) {
    throw new Error('Please provide one or more component names')
  }

  names.forEach(async (name) => {
    const currentFolder = process.cwd()
    const componentFileName = getComponentFileName()
    const storyFileName = getStoryFileName()
    const componentFolderName = getComponentFolderName(name)
    const destFolder = path.join(currentFolder, componentFolderName)
    const componentDestPath = path.join(destFolder, componentFileName)
    const storyDestPath = path.join(destFolder, storyFileName)
    
    spinner.start(`Creating component ${componentFolderName}`)
    
    const exists = await fs.pathExists(destFolder)
    if (exists) {
      spinner.fail(`Folder ${destFolder} already exists.`)
      return
    }
    
    const renderedComponent = await render(Templates.component, {
      name,
    })
    const renderedStory = await render(Templates.componentStory, {
      name,
    })

    await fs.mkdir(destFolder)
    await fs.writeFile(componentDestPath, renderedComponent)
    await fs.writeFile(storyDestPath, renderedStory)
    spinner.succeed()
  })
}
