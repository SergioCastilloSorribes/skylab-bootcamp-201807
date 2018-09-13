const mongoose = require('mongoose')
const { Team } = require('./schemas')

module.exports = mongoose.model('Team', Team)