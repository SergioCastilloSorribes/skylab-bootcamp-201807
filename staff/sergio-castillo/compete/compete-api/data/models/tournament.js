const mongoose = require('mongoose')
const { Tournament } = require('./schemas')

module.exports = mongoose.model('Tournament', Tournament)