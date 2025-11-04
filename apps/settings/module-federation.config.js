const { withModuleFederation } = require('@nx/webpack/module-federation');
module.exports = withModuleFederation({ name: 'settings', exposes: { './Module': './apps/settings/src/remote-entry.tsx' }, shared: (n,c)=>c });
