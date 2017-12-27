import * as path from 'path';
import { getNewModuleFolders } from '../logic';

describe.only('#getNewModuleFolders', () => {
  it('returns dispatchable folders correctly', () => {
    const modulesDir = '/Users/project/src/modules/my-module';
    expect(getNewModuleFolders(modulesDir))
    .toEqual([{
      path: '/Users/project/src/modules/my-module/components',
    }, {
      path: '/Users/project/src/modules/my-module/containers',
    }, {
      path: '/Users/project/src/modules/my-module/queries',
    }, {
      path: '/Users/project/src/modules/my-module/mutations',
    }, {
      path: '/Users/project/src/modules/my-module/logic',
    }, {
      path: '/Users/project/src/modules/my-module/hocs',
    }]);
  });
});
