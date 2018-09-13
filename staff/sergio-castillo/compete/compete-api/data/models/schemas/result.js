'use strict'

const { Schema, Schema: { Types: { ObjectId } } } = require('mongoose')

module.exports = new Schema({

    firstTeamId: [{
        type: ObjectId,
        ref: 'Team'
    }],

    secondTeamId: [{
        type: ObjectId,
        ref: 'Team'
    }],

    goalsFirstTeam: {
        type: Number
    },

    goalsSecondTeam: {
        type: Number
    }

})