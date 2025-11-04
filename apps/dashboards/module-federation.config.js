const { withModuleFederation } = require('@nx/webpack/module-federation');
module.exports = withModuleFederation({ name: 'dashboards', exposes: { './Module': './apps/dashboards/src/remote-entry.tsx' }, shared: (n,c)=>c });
