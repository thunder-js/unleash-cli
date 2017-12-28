import spinner from './spinner'
import * as ora from 'ora'

export default class UI {
  public spinner = spinner
  public newSpinner = ora
  public log = (text: string) => console.log(text)
}
