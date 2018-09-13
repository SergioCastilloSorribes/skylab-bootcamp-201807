'use strict'

const { Schema } = require('mongoose')

function validatePassword(password) {
    if (password.length < 6) throw Error(`The password length is too short`)
}

function validateDni(dni) {
    if (dni.length < 9) throw Error (`The DNI ${dni} is not correct`)
}

function validateAge(age){
    if (age<14 || age>70) throw Error (`The age ${age} is not a correct age to participate`)
}

function validateHeight(height){
    if (height<130 || height>250) throw Error (`The height ${height} is not a correct height to participate`)
}

function validateWeight(weight){
    if (weight<45 || weight>130) throw Error (`The weight ${weight} is not a correct weight to participate`)
}

function validateSquadNumber (squadNumber){
    if (squadNumber<1 || squadNumber>99) throw Error (`The squad number ${squadNumber} is not a correct number to participate`)
}

module.exports = new Schema({

    dni: {
        type: String,
        validate: validateDni
    },

    name: {
        type: String
    },

    surname: {
        type: String
    },

    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true
    },

    password: {
        type: String,
        required: true,
        validate: validatePassword
    },

    photo: {
        type: String
    },

    role: {
        type: Array,
        // enum: ['organizer', 'manager', 'player']
    },

    age: {
        type: Number,
        validate: validateAge
    },

    gender: {
        type: String,
        enum: ['female', 'male', 'other']
    },

    height: {
        type: Number,
        validate: validateHeight
    },

    weight: {
        type: Number,
        validate: validateWeight
    },

    squadNumber: {
        type: Number,
        validate: validateSquadNumber
    },

    position: {
        type: String
    }

})