# UnleasH

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

3. Edit the generated json file (Most of the data will be already filled in for you)

4. Unleash a new project from that seed
```
unleash project grow ./seed.json
```

5. Enjoy!
- You will have a production ready base project with a lot of common features, most of them using reusable components from (https://github.com/thunder-js)
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
release-store:ios
```