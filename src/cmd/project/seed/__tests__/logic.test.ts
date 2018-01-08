import * as path from 'path';
import { getSeedContent, SEED_TYPE } from '../logic'

describe('#getSeedContent', () => {
  it('return contents empty json for null name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE))
    .toEqual({
      name: '',
      node: {
        packageName: '',
      },
      facebook: {
        appId: '',
        appDisplayName: '',
      },
      googleMaps: {
        apiKey: '',
      },
      assets: {
        icon: '',
        splash: '',
      },
      ios: {
        displayName: '',
        projectName: '',
        bundleName: '',
        fastlane: {
          itcTeamId: '',
          teamId: '',
          appleId: '',
          certificatesRepoUrl: '',
          slackUrl: '',
        },
      },
      android: {
        displayName: '',
        bundleName: '',
      },
    });
  });

  it('return contents correctly for name with Capitalized letters and Spaces', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'Bro Challenge'))
    .toEqual({
      name: 'Bro Challenge',
      node: {
        packageName: 'bro-challenge',
      },
      facebook: {
        appId: '',
        appDisplayName: 'Bro Challenge',
      },
      googleMaps: {
        apiKey: '',
      },
      assets: {
        icon: '',
        splash: '',
      },
      ios: {
        displayName: 'Bro Challenge',
        projectName: 'Bro-Challenge',
        bundleName: 'com.thunderjs.bro-challenge',
        fastlane: {
          itcTeamId: '',
          teamId: '',
          appleId: '',
          certificatesRepoUrl: '',
          slackUrl: '',
        },
      },
      android: {
        displayName: 'Bro Challenge',
        bundleName: 'com.thunderjs.bro-challenge',
      },
    });
  });

  it('return contents correctly for name with all Capitalized letters and Spaces', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'BRO CHALLENGE'))
    .toEqual({
      name: 'BRO CHALLENGE',
      node: {
        packageName: 'bro-challenge',
      },
      facebook: {
        appId: '',
        appDisplayName: 'BRO CHALLENGE',
      },
      googleMaps: {
        apiKey: '',
      },
      assets: {
        icon: '',
        splash: '',
      },
      ios: {
        displayName: 'BRO CHALLENGE',
        projectName: 'BRO-CHALLENGE',
        bundleName: 'com.thunderjs.bro-challenge',
        fastlane: {
          itcTeamId: '',
          teamId: '',
          appleId: '',
          certificatesRepoUrl: '',
          slackUrl: '',
        },
      },
      android: {
        displayName: 'BRO CHALLENGE',
        bundleName: 'com.thunderjs.bro-challenge',
      },
    });
  });

  it('return contents correctly for simple name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'Facebook'))
    .toEqual({
      name: 'Facebook',
      node: {
        packageName: 'facebook',
      },
      facebook: {
        appId: '',
        appDisplayName: 'Facebook',
      },
      googleMaps: {
        apiKey: '',
      },
      assets: {
        icon: '',
        splash: '',
      },
      ios: {
        displayName: 'Facebook',
        projectName: 'Facebook',
        bundleName: 'com.thunderjs.facebook',
        fastlane: {
          itcTeamId: '',
          teamId: '',
          appleId: '',
          certificatesRepoUrl: '',
          slackUrl: '',
        },
      },
      android: {
        displayName: 'Facebook',
        bundleName: 'com.thunderjs.facebook',
      },
    });
  });

  it('return contents correctly for PascalCase name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'WhatsApp'))
    .toEqual({
      name: 'WhatsApp',
      node: {
        packageName: 'whatsapp',
      },
      facebook: {
        appId: '',
        appDisplayName: 'WhatsApp',
      },
      googleMaps: {
        apiKey: '',
      },
      assets: {
        icon: '',
        splash: '',
      },
      ios: {
        displayName: 'WhatsApp',
        projectName: 'WhatsApp',
        bundleName: 'com.thunderjs.whatsapp',
        fastlane: {
          itcTeamId: '',
          teamId: '',
          appleId: '',
          certificatesRepoUrl: '',
          slackUrl: '',
        },
      },
      android: {
        displayName: 'WhatsApp',
        bundleName: 'com.thunderjs.whatsapp',
      },
    });
  });

  it('return contents correctly for camelCase name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'whatsApp'))
    .toEqual({
      name: 'whatsApp',
      node: {
        packageName: 'whatsapp',
      },
      facebook: {
        appId: '',
        appDisplayName: 'whatsApp',
      },
      googleMaps: {
        apiKey: '',
      },
      assets: {
        icon: '',
        splash: '',
      },
      ios: {
        displayName: 'whatsApp',
        projectName: 'whatsApp',
        bundleName: 'com.thunderjs.whatsapp',
        fastlane: {
          itcTeamId: '',
          teamId: '',
          appleId: '',
          certificatesRepoUrl: '',
          slackUrl: '',
        },
      },
      android: {
        displayName: 'whatsApp',
        bundleName: 'com.thunderjs.whatsapp',
      },
    });
  });

  it('return contents correctly for lowercase name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'myname'))
    .toEqual({
      name: 'myname',
      node: {
        packageName: 'myname',
      },
      facebook: {
        appId: '',
        appDisplayName: 'myname',
      },
      googleMaps: {
        apiKey: '',
      },
      assets: {
        icon: '',
        splash: '',
      },
      ios: {
        displayName: 'myname',
        projectName: 'myname',
        bundleName: 'com.thunderjs.myname',
        fastlane: {
          itcTeamId: '',
          teamId: '',
          appleId: '',
          certificatesRepoUrl: '',
          slackUrl: '',
        },
      },
      android: {
        displayName: 'myname',
        bundleName: 'com.thunderjs.myname',
      },
    });
  });

  it('return contents correctly for special characters name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'João-Louco Da sílva'))
    .toEqual({
      name: 'João-Louco Da sílva',
      node: {
        packageName: 'joao-louco-da-silva',
      },
      facebook: {
        appId: '',
        appDisplayName: 'João-Louco Da sílva',
      },
      googleMaps: {
        apiKey: '',
      },
      assets: {
        icon: '',
        splash: '',
      },
      ios: {
        displayName: 'João-Louco Da sílva',
        projectName: 'Joao-Louco-Da-silva',
        bundleName: 'com.thunderjs.joao-louco-da-silva',
        fastlane: {
          itcTeamId: '',
          teamId: '',
          appleId: '',
          certificatesRepoUrl: '',
          slackUrl: '',
        },
      },
      android: {
        displayName: 'João-Louco Da sílva',
        bundleName: 'com.thunderjs.joao-louco-da-silva',
      },
    });
  });

});
