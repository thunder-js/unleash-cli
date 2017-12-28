import * as fs from 'fs-extra'
import * as ejs from 'ejs'
import * as path from 'path'
import { Data } from 'ejs';

export const render = async (templateName: string, data: Data) => {
  const templateFilePath = path.join(__dirname, '../../templates', `${templateName}.ejs`)
  const template = await fs.readFile(templateFilePath, 'utf8')
  const rendered = ejs.render(template, data)

  return rendered
}