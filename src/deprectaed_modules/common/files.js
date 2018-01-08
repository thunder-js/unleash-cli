import fs from 'fs-extra'

export const safelyWrite = async (destPath, content, force) => {
  const destExists = await fs.exists(destPath)
  if (!force && destExists) {
    throw new Error(`File ${destPath} already exists.`)
  }
  return fs.writeFile(destPath, content)
}

export const safelyRead = async (filePath) => {
  const exists = await fs.pathExists(filePath)
  if (!exists) {
    throw new Error(`File ${filePath} does not exist.`)
  }

  return fs.readFile(filePath, 'utf8')
}
