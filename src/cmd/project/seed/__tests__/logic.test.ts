import { getSeedContent, SEED_TYPE } from '../logic'

describe('#getSeedContent', () => {
  it('return contents empty json for null name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE))
    .toEqual({
      type: SEED_TYPE.REACT_NATIVE,
      template: 'git@github.com:thunder-js/react-native-ts-lab.git',
      tag: '1.0.0',
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
        bundleIdentifier: '',
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
        displayName: '',
        bundleIdentifier: '',
        codePush: {
          name: '',
        },
      },
    });
  });

  it('return contents correctly for name with Capitalized letters and Spaces', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'Bro Challenge'))
    .toEqual({
      type: SEED_TYPE.REACT_NATIVE,
      template: 'git@github.com:thunder-js/react-native-ts-lab.git',
      tag: '1.0.0',
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
        projectName: 'BroChallenge',
        bundleIdentifier: 'com.thunderjs.bro-challenge',
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
          name: 'BroChallenge-iOS',
        },
      },
      android: {
        displayName: 'Bro Challenge',
        bundleIdentifier: 'com.thunderjs.bro-challenge',
        codePush: {
          name: 'BroChallenge-Android',
        },
      },
    });
  });

  it('return contents correctly for name with all Capitalized letters and Spaces', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'BRO CHALLENGE'))
    .toEqual({
      type: SEED_TYPE.REACT_NATIVE,
      template: 'git@github.com:thunder-js/react-native-ts-lab.git',
      tag: '1.0.0',
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
        projectName: 'BROCHALLENGE',
        bundleIdentifier: 'com.thunderjs.bro-challenge',
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
          name: 'BROCHALLENGE-iOS',
        },
      },
      android: {
        displayName: 'BRO CHALLENGE',
        bundleIdentifier: 'com.thunderjs.bro-challenge',
        codePush: {
          name: 'BROCHALLENGE-Android',
        },
      },
    });
  });

  it('return contents correctly for simple name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'Facebook'))
    .toEqual({
      type: SEED_TYPE.REACT_NATIVE,
      template: 'git@github.com:thunder-js/react-native-ts-lab.git',
      tag: '1.0.0',
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
        bundleIdentifier: 'com.thunderjs.facebook',
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
          name: 'Facebook-iOS',
        },
      },
      android: {
        displayName: 'Facebook',
        bundleIdentifier: 'com.thunderjs.facebook',
        codePush: {
          name: 'Facebook-Android',
        },
      },
    });
  });

  it('return contents correctly for PascalCase name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'WhatsApp'))
    .toEqual({
      type: SEED_TYPE.REACT_NATIVE,
      template: 'git@github.com:thunder-js/react-native-ts-lab.git',
      tag: '1.0.0',
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
        bundleIdentifier: 'com.thunderjs.whatsapp',
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
          name: 'WhatsApp-iOS',
        },
      },
      android: {
        displayName: 'WhatsApp',
        bundleIdentifier: 'com.thunderjs.whatsapp',
        codePush: {
          name: 'WhatsApp-Android',
        },
      },
    });
  });

  it('return contents correctly for camelCase name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'whatsApp'))
    .toEqual({
      type: SEED_TYPE.REACT_NATIVE,
      template: 'git@github.com:thunder-js/react-native-ts-lab.git',
      tag: '1.0.0',
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
        bundleIdentifier: 'com.thunderjs.whatsapp',
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
          name: 'whatsApp-iOS',
        },
      },
      android: {
        displayName: 'whatsApp',
        bundleIdentifier: 'com.thunderjs.whatsapp',
        codePush: {
          name: 'whatsApp-Android',
        },
      },
    });
  });

  it('return contents correctly for lowercase name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'myname'))
    .toEqual({
      type: SEED_TYPE.REACT_NATIVE,
      template: 'git@github.com:thunder-js/react-native-ts-lab.git',
      tag: '1.0.0',
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
        bundleIdentifier: 'com.thunderjs.myname',
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
          name: 'myname-iOS',
        },
      },
      android: {
        displayName: 'myname',
        bundleIdentifier: 'com.thunderjs.myname',
        codePush: {
          name: 'myname-Android',
        },
      },
    });
  });

  it('return contents correctly for special characters name', () => {
    expect(getSeedContent(SEED_TYPE.REACT_NATIVE, 'João-Louco Da sílva'))
    .toEqual({
      type: SEED_TYPE.REACT_NATIVE,
      template: 'git@github.com:thunder-js/react-native-ts-lab.git',
      tag: '1.0.0',
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
        projectName: 'JoaoLoucoDasilva',
        bundleIdentifier: 'com.thunderjs.joao-louco-da-silva',
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
          name: 'JoaoLoucoDasilva-iOS',
        },
      },
      android: {
        displayName: 'João-Louco Da sílva',
        bundleIdentifier: 'com.thunderjs.joao-louco-da-silva',
        codePush: {
          name: 'JoaoLoucoDasilva-Android',
        },
      },
    });
  });

});
