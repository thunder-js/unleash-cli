import path from 'path'
import pkgDir from 'pkg-dir'
import { safelyRead, safelyWrite } from './files';
import { SRC_DIR } from './constants'

export const getStoriesFilePath = async (cwd) => {
  const projectRootFolder = await pkgDir(cwd)
  return projectRootFolder ? path.join(projectRootFolder, SRC_DIR, 'stories.js') : null
}

export const getAppendedStoryFileContent = (stories, newStoryPath) => `${stories}require('${newStoryPath}');\n`

export const appendStory = async (storyRequirePath) => {
  const storiesFilePath = await getStoriesFilePath(process.cwd())
  const storiesFileContent = await safelyRead(storiesFilePath)
  const storyAlreadyRegistered = storiesFileContent.indexOf(storyRequirePath) !== -1
  if (!storyAlreadyRegistered) {
    const newStoriesFileContent = getAppendedStoryFileContent(storiesFileContent, storyRequirePath)
    await safelyWrite(storiesFilePath, newStoriesFileContent, true)
    return true
  }
  return false
}

