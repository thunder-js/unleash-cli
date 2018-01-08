import { IContext } from '../../../common/context'
import { getSeedFile, SEED_TYPE } from './logic'

export interface ICreateSeed {
  type: SEED_TYPE;
  name: string;
}
export const createSeed = async ({ type, name }: ICreateSeed, ctx: IContext) => {
  ctx.ui.spinner.start('Creating seed file...')
  const seedFile = getSeedFile(ctx.cwd, type, name)
  ctx.fileDispatcher.dispatch(seedFile)

  ctx.ui.spinner.succeed()
}
