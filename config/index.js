const path = require('path')
const _ = require('lodash')

// Load default settings
const defaults = require('./default')

// Which environment we are in? If not available use default.
const config = require(path.join(__dirname, (process.env.NODE_ENV || defaults.env)))

// Merge current environment settings into defaults
module.exports = _.merge({}, defaults, config)
