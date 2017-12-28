import * as fs from 'fs-extra'

export const safelyRead = async (filePath) => {
  const exists = await fs.pathExists(filePath)
  if (!exists) {
    throw new Error(`File ${filePath} does not exist.`)
  }

  return fs.readFile(filePath, 'utf8')
}
