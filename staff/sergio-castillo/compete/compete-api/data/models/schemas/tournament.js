'use strict'

const { Schema, Schema: { Types: { ObjectId } } } = require('mongoose')

module.exports = new Schema({

    nameTournament: {
        type: String,
        required: true,
    },

    organizer: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    teams: [{
        type: ObjectId,
        ref: 'Team'
    }],

    matches: [{
        type: ObjectId,
        ref: 'Match'
    }],

    state : {
        type: String,
        enum: ['creating', 'playing', 'finish']
    },

    roundMatches: Number,

    winners: Array

})