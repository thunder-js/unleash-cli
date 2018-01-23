import * as Joi from 'joi'
export const schema = Joi.object().keys({
  type: Joi.string().required(),
  template: Joi.string().required(),
  name: Joi.string().required(),
  node: Joi.object().keys({
    packageName: Joi.string().required(),
  }).required(),
  facebook: Joi.object().keys({
    appId: Joi.string(),
    appDisplayName: Joi.string(),
  }),
  googleMaps: Joi.object().keys({
    apiKey: Joi.string(),
  }),
  assets: Joi.object().keys({
    icon: Joi.string(),
    splash: Joi.string(),
  }),
  ios: Joi.object().keys({
    displayName: Joi.string().required(),
    projectName: Joi.string().required(),
    bundleIdentifier: Joi.string().required(),
    fastlane: Joi.object().keys({
      itcTeamId: Joi.string().required(),
      itcTeamName: Joi.string().required(),
      teamName: Joi.string().required(),
      teamId: Joi.string().required(),
      appleId: Joi.string().required(),
      certificatesRepoUrl: Joi.string().required(),
      slackUrl: Joi.string().required(),
    }).required(),
  }),
  android: Joi.object().keys({
    displayName: Joi.string().required(),
    bundleIdentifier: Joi.string().required(),
  }).required(),
})
