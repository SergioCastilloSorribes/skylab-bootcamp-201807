const mongoose = require('mongoose')
const { Result } = require('./schemas')

module.exports = mongoose.model('Result', Result)