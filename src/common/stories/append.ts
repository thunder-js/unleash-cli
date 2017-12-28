// export const getAppendedStoryFileContent = (stories, newStoryPath) => `${stories}require('${newStoryPath}');\n`

// export const appendStory = async (storyRequirePath) => {
//   const storiesFilePath = await getStoriesFilePath(process.cwd())
//   const storiesFileContent = await safelyRead(storiesFilePath)
//   const storyAlreadyRegistered = storiesFileContent.indexOf(storyRequirePath) !== -1
//   if (!storyAlreadyRegistered) {
//     const newStoriesFileContent = getAppendedStoryFileContent(storiesFileContent, storyRequirePath)
//     await safelyWrite(storiesFilePath, newStoriesFileContent, true)
//     return true
//   }
//   return false
// }
