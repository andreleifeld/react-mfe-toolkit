const { withModuleFederation } = require('@nx/webpack/module-federation');
module.exports = withModuleFederation({ name: 'reports', exposes: { './Module': './apps/reports/src/remote-entry.tsx' }, shared: (n,c)=>c });
