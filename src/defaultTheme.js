const cloneDeep = require('lodash/cloneDeep')
const defaultConfig = require('./defaultConfig.stub.js')

module.exports = cloneDeep(defaultConfig.theme)
