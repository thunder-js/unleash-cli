import { IDispatchableFile } from '../../react/model/dispatchable-file';
import * as path from 'path'
import { remove as removeDiacritics } from 'diacritics'
import { FileNames } from '../../../common/constants';
import { removeSpaces, toLowerCase, removeHyphen } from '../../../common/string'
import * as R from 'ramda';

export enum SEED_TYPE {
  REACT_NATIVE = 'REACT_NATIVE',
  REACT_WEB = 'REACT_WEB',
  GRAPHCOOL = 'GRAPHCOOL',
  SERVICE = 'SERVICE',
}

const spaceToHyphen = (text: string): string => text.replace(new RegExp(' ', 'g'), '-')

const getBundleName = (name: string): string => `com.thunderjs.${R.pipe(removeDiacritics, spaceToHyphen, toLowerCase)(name)}`

const getFacebookAppDisplayName = (name: string): string => name
const getIosDisplayName = (name: string): string => name
const getIosProjectName = (name: string): string => R.pipe(removeDiacritics, spaceToHyphen)(name)
const getIosBundleName = (name: string): string => getBundleName(name)
const getAndroidDisplayName = (name: string): string => name
const getAndroidBundleName = (name: string): string => getBundleName(name)
const getNodePackageName = (name: string): string => R.pipe(removeDiacritics, spaceToHyphen, toLowerCase)(name)

export const getReactNativeSeedContent = (name: string): {[key: string]: any} => ({
  name : name ? name : '',
  node: {
    packageName: name ? getNodePackageName(name) : '',
  },
  facebook: {
    appId: '',
    appDisplayName: name ? getFacebookAppDisplayName(name) : '',
  },
  googleMaps: {
    apiKey: '',
  },
  assets: {
    icon: '',
    splash: '',
  },
  ios: {
    displayName: name ? getIosDisplayName(name) : '',
    projectName: name ? getIosProjectName(name) : '',
    bundleName: name ? getIosBundleName(name) : '',
    fastlane: {
      itcTeamId: '',
      teamId: '',
      appleId: '',
      certificatesRepoUrl: '',
      slackUrl: '',
    },
  },
  android: {
    displayName: name ? getAndroidDisplayName(name) : '',
    bundleName: name ? getAndroidBundleName(name) : '',
  },
})

export const getSeedContent = (type: SEED_TYPE, name?: string): {[key: string]: any} => {
  switch (type) {
    case SEED_TYPE.REACT_NATIVE:
      return getReactNativeSeedContent(name)
    case SEED_TYPE.REACT_WEB:
    default:
      return null
  }
}

export const getSeedFile = (projectRoot: string, type: SEED_TYPE, name?: string): IDispatchableFile => {
  return {
    path: path.join(projectRoot, FileNames.seed),
    content: JSON.stringify(getSeedContent(type, name), null, 2),
  }
}
