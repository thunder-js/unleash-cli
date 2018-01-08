import fs from 'fs-extra'
import ejs from 'ejs'
import path from 'path'

export const render = async (templateName, data) => {
  const templateFilePath = path.join(__dirname, '../../templates', `${templateName}.ejs`) 
  const template = await fs.readFile(templateFilePath, 'utf8')
  const rendered = ejs.render(template, data)

  return rendered
}
