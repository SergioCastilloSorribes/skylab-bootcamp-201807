const mongoose = require('mongoose')
const { Match } = require('./schemas')

module.exports = mongoose.model('Match', Match)