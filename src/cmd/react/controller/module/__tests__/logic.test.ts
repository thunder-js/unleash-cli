import * as path from 'path';
import { getNewModuleFolders } from '../logic';

describe('#getNewModuleFolders', () => {
  it('returns dispatchable folders correctly', () => {
    const modulesDir = '/Users/project/src/modules/my-module';
    expect(getNewModuleFolders(modulesDir))
    .toEqual([{
      path: '/Users/project/src/modules/my-module/components',
      p: true,
    }, {
      path: '/Users/project/src/modules/my-module/containers',
      p: true,
    }, {
      path: '/Users/project/src/modules/my-module/queries',
      p: true,
    }, {
      path: '/Users/project/src/modules/my-module/mutations',
      p: true,
    }, {
      path: '/Users/project/src/modules/my-module/logic',
      p: true,
    }, {
      path: '/Users/project/src/modules/my-module/hocs',
      p: true,
    }]);
  });
});
