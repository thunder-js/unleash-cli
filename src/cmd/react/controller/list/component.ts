import { IContext } from '../../../../common/context'

export default async (componentName: string, context: IContext) => {
  console.log(context)
  console.log(`Creating list component ${componentName}`)
}