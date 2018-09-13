'use strict'

const { Schema, Schema: { Types: { ObjectId } } } = require('mongoose')

module.exports = new Schema({

    date: {
        type: Date,
    },

    teams: [{
        type: ObjectId,
        ref: 'Team'
    }],

    result: [{
        type: ObjectId,
        ref: 'Result'
    }],

})