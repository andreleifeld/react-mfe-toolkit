const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const moduleFederationConfig = require('./module-federation.config');

module.exports = composePlugins(withNx(), withReact(), async (config, context) => {
  config.experiments ??= {};
  config.experiments.topLevelAwait = true;

  const applyModuleFederation = await moduleFederationConfig;
  return applyModuleFederation(config, context);
});
