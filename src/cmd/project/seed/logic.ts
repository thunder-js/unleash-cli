import { IDispatchableFile } from '../../react/model/dispatchable-file';
import * as path from 'path'
import { remove as removeDiacritics } from 'diacritics'
import { FileNames } from '../../../common/constants';
import { toLowerCase } from '../../../common/string'
import * as R from 'ramda';

export enum SEED_TYPE {
  REACT_NATIVE = 'REACT_NATIVE',
  REACT_WEB = 'REACT_WEB',
  GRAPHCOOL = 'GRAPHCOOL',
  SERVICE = 'SERVICE',
}

const TEMPLATE_URL = {
  reactNative: 'git@github.com:thunder-js/react-native-ts-lab.git',
}

export interface IReactNativeSeed {
  type: string,
  template: string,
  tag: string,
  name: string,
  node: {
    packageName: string,
  },
  facebook: {
    appId: string,
    appDisplayName: string,
  },
  googleMaps: {
    apiKey: string,
  },
  assets: {
    icon: string,
    splash: string,
  },
  ios: {
    displayName: string,
    projectName: string,
    bundleIdentifier: string,
    fastlane: {
      itcTeamId: string,
      itcTeamName: string,
      teamName: string,
      teamId: string,
      appleId: string,
      certificatesRepoUrl: string,
      slackUrl: string,
    },
    codePush: {
      name: string,
    },
  },
  android: {
    displayName: string,
    bundleIdentifier: string,
    codePush: {
      name: string,
    },
  },
}

const spaceToHyphen = (text: string): string => text.replace(new RegExp(' ', 'g'), '-')
const removeSpaces = (text: string): string => text.replace(new RegExp(' ', 'g'), '')
const removeHyphen = (text: string): string => text.replace(new RegExp('-', 'g'), '')

const getBundleName = (name: string): string => `com.thunderjs.${R.pipe(removeDiacritics, spaceToHyphen, toLowerCase)(name)}`

const getFacebookAppDisplayName = (name: string): string => name
const getIosDisplayName = (name: string): string => name
const getIosProjectName = (name: string): string => R.pipe(removeDiacritics, removeSpaces, removeHyphen)(name)
const getIosBundleName = (name: string): string => getBundleName(name)
const getAndroidDisplayName = (name: string): string => name
const getAndroidBundleName = (name: string): string => getBundleName(name)
const getNodePackageName = (name: string): string => R.pipe(removeDiacritics, spaceToHyphen, toLowerCase)(name)

export const getReactNativeSeedContent = (name: string): IReactNativeSeed => ({
  type: SEED_TYPE.REACT_NATIVE,
  template: TEMPLATE_URL.reactNative,
  name : name ? name : '',
  tag: '1.0.0',
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
    bundleIdentifier: name ? getIosBundleName(name) : '',
    fastlane: {
      itcTeamName: '',
      itcTeamId: '',
      teamName: '',
      teamId: '',
      appleId: '',
      certificatesRepoUrl: '',
      slackUrl: '',
    },
    codePush: {
      name: '',
    },
  },
  android: {
    displayName: name ? getAndroidDisplayName(name) : '',
    bundleIdentifier: name ? getAndroidBundleName(name) : '',
    codePush: {
      name: '',
    },
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

export const assocCodePushKeys = (seed, iosCodePushKeys, androidCodePushKeys) => ({
  ...seed,
  ios: {
    ...seed.ios,
    codePush: iosCodePushKeys,
  },
  android: {
    ...seed.android,
    codePush: androidCodePushKeys,
  },
})
