import fs from 'fs-extra'

export const createFolders = foldersPaths => Promise.all(foldersPaths.map(folderPath => fs.mkdirp(folderPath)))
