# UnleasH

🚧 WORK IN PROGRESS 🚧 (Specially for Android)

![UnleasH](https://raw.githubusercontent.com/rafaelcorreiapoli/unleash-cli/master/resources/demon.jpg)

*" Everything you need to make money! "*



## Installation
```
npm install -g unleash-cli
```

## Usage
1. Create a folder for your project
```
mkdir my-project
cd my-project
```
2. Unleash the project seed
```
unleash project seed react-native -n "Quack Pack"
```

3. Edit the generated json file (Most of the data will be already filled in for you). It looks like this
```
{
  "type": "REACT_NATIVE",
  "template": "git@github.com:thunder-js/react-native-ts-lab.git",
  "name": "Quack Pack",
  "node": {
    "packageName": "quack-pack"
  },
  "facebook": {
    "appId": "",
    "appDisplayName": "Quack Pack"
  },
  "assets": {
    "icon": "https://my.icon/icon.png",
    "splash": "https://my.splash/splash.png"
  },
  "ios": {
    "displayName": "Quack Pack",
    "projectName": "QuackPack",
    "bundleIdentifier": "com.quack-pack.app",
    "googleMaps": {
      "apiKey": ""
    },
    "fastlane": {
      "itcTeamName": "Rafael Ribeiro Correia",
      "itcTeamId": "WRM4UPAZ5R",
      "teamName": "Rafael Ribeiro Correia",
      "teamId": "118298111",
      "appleId": "rafael.correia.poli@gmail.com",
      "certificatesRepoUrl": "git@github.com:rafaelcorreiapoli/apple-certificates.git",
      "slackUrl": "https://hooks.slack.com/services/hihihi/hahahaha/hehehe"
    },
    "codePush": {
      "name": "QuackPack-iOS",
    }
  },
  "android": {
    "displayName": "Quack Pack",
    "bundleIdentifier": "com.quack-pack.app",
    "codePush": {
      "name": "QuackPack-Android",
    }
  }
}
```

4. Unleash a new project from that seed
```
unleash project grow ./seed.json
```

5. Enjoy!
- You will have a production ready base project with a lot of common features, most of them using reusable components from (https://github.com/thunder-js), including:
  - Storybook (with HMR)
  - Storyshots
  - Haul packager for symlinks
  - TypeScript
  - CodePush
  - Fastlane
  - Snapshot testing
  - Detox E2E tests
  - Analytics
  - Crashlytics
  - Authentication with Facebook & E-mail (checkout https://github.com/thunder-js/storm-auth)
  - Apollo 2.0
  - Forms with `react-final-form`
  - Onboarding (checkout https://github.com/thunder-js/storm-onboarding)
  - Basic App flow (checkout https://github.com/thunder-js/storm-foundation)


- A circleCI config will be generated for you, just go to circleCI (https://circleci.com/) and add your project
The pipeline works as follows:
  - When you open a PR on Github, circleCI will build and test (unit, integration, e2e with detox) the project, allowing abort early workflow for bad PRs
  - When something is merged to master, circleCI will build and test the project, and then upload it to test distribution mechanisms (TestFlight & GooglePlay Beta Store)
  - After your beta users approve the app (or any QA process) you have to manually promote the app to production on circleCI dashboard. This will cause the build to be uploaded to the distribution stores (AppStore & Google Play)
 
- CodePush will be configured for you, use these scripts to update the app for your users: (I'm still studying how to integrate this in the CI pipeline)
```
yarn run release-push:ios
```
```
yarn run release-push:android
```
- All the iOS certificates will be provisioned and uploaded to the specified git repo (https://codesigning.guide/)
- The app will be created on AppStore and iTunes Connect, to *manually* push a new version to TestFlight, just run this script:
```
yarn run beta-store:ios
```
- To *manually* release a new version to AppStore, just run:
```
yarn release-store:ios
```