'use strict'

const { Schema, Schema: { Types: { ObjectId } } } = require('mongoose')

module.exports = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        maxlength: 1000
    },

    owner: {
        type: String
    },

    manager: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    squad: [{
        type: ObjectId,
        ref: 'User'
    }]

})