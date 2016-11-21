const path = require('path')
const devServerConfig = require('webpack-config-trainiac/devserver')
const srcPath = path.join(__dirname, 'client')
const buildPath = path.join(srcPath, 'build')

module.exports = devServerConfig(buildPath, srcPath)
