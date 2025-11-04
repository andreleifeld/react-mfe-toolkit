const { composePlugins, withNx } = require('@nx/webpack');
const mf = require('./module-federation.config');
module.exports = composePlugins(withNx(), (config)=>{config.experiments={topLevelAwait:true}; return {...config, ...mf};});
