const { withModuleFederation } = require('@nx/webpack/module-federation');
module.exports = withModuleFederation({ name: 'shell', remotes: [ ['dashboards','http://localhost:4201/remoteEntry.js'], ['reports','http://localhost:4202/remoteEntry.js'], ['settings','http://localhost:4203/remoteEntry.js'] ], shared: (n,c)=>c });
