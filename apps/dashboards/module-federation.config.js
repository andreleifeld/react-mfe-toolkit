const { withModuleFederation } = require('@nx/module-federation/webpack');

module.exports = withModuleFederation({
  name: 'dashboards',
  exposes: {
    './Module': './src/remote-entry.tsx',
  },
  shared: (name, config) => config,
});
