require('dotenv').config()

const { logic } = require('.')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose
const { User, Team, Tournament, Match, Result } = require('../data/models')
const chunk = require('../utils/chunk/index.js')

const { env: { MONGO_URL } } = process

describe('logic', () => {

    const email = `sergio${Math.random()}@mail.com`
    const password = `password${Math.random()}`
    const dni = `${Math.floor(Math.random() * 100000000)}N`
    const name = `Sergio${Math.random()}`
    const surname = `Castillo${Math.random()}`
    const age = 37
    const gender = 'male'
    const height = 172
    const weight = 68
    const position = 'Defender'
    const squadNumber = 4
    const photo = chunk
    const id2 = new ObjectId().toString()
    let _connection
    let usersCount = 0
    let id

    before(() =>
        mongoose.connect(MONGO_URL, { useNewUrlParser: true })
            .then(conn => _connection = conn)
    )

    beforeEach(() =>
        Promise.all([
            User.deleteMany(),
            Team.deleteMany(),
            Tournament.deleteMany(),
            Match.deleteMany(),
            Result.deleteMany()
        ])
            .then(() => {
                let count = Math.floor(Math.random() * 100)

                const creations = []

                while (count--) creations.push({ email: `other-${Math.random()}@mail.com`, password: `123-${Math.random()}` })
                // dni:`${Math.floor(Math.random()*10000000000)}E` 
                if (usersCount = creations.length)
                    return User.create(creations)
            })
    )

    // Validates

    !true && describe('validate string fields', () => {
        it('should succeed on correct value', () => {
            expect(() => logic._validateStringField('email', email).to.equal(email))
            expect(() => logic._validateStringField('password', password).to.equal(password))
        })

        it('should fail on undefined value', () => {
            expect(() => logic._validateStringField('name', undefined)).to.throw(`invalid name`)
        })

        it('should fail on empty value', () => {
            expect(() => logic._validateStringField('name', '')).to.throw(`invalid name`)
        })

        it('should fail on numeric value', () => {
            expect(() => logic._validateStringField('name', 123)).to.throw(`invalid name`)
        })
    })

    !true && describe('validate number fields', () => {
        const age = 37
        it('should succeed on correct value', () => {
            expect(() => logic._validateNumberField('age', age).to.equal(age))
        })

        it('should fail on undefined value', () => {
            expect(() => logic._validateNumberField('age', undefined)).to.throw(`invalid age`)
        })

        it('should fail on empty value', () => {
            expect(() => logic._validateNumberField('age', '')).to.throw(`invalid age`)
        })

        it('should fail on string value', () => {
            expect(() => logic._validateNumberField('age', '123')).to.throw(`invalid age`)
        })
    })

    !true && describe('validate email fields', () => {
        it('should succeed on correct value', () => {
            expect(() => logic._validateEmail('email', email).to.equal(email))
        })

        it('should fail on undefined value', () => {
            expect(() => logic._validateEmail('email', undefined)).to.throw(`invalid email`)
        })

        it('should fail on empty value', () => {
            expect(() => logic._validateEmail('email', '')).to.throw(`invalid email`)
        })

        it('should fail on numeric value', () => {
            expect(() => logic._validateEmail('email', 123)).to.throw(`invalid email`)
        })

        it('should fail on wrong email: without dot and the last three letters', () => {
            expect(() => logic._validateEmail('email', 'sergiocastillo@gmail')).to.throw(`invalid email`)
        })

        it('should fail on wrong email: four letters after dot', () => {
            expect(() => logic._validateEmail('email', 'sergiocastillo@d.rondo')).to.throw(`invalid email`)
        })

        it('should fail on wrong email: without letters before the @', () => {
            expect(() => logic._validateEmail('email', '@gmail.com')).to.throw(`invalid email`)
        })

        it('should fail on wrong email: with xxx after dot', () => {
            expect(() => logic._validateEmail('email', 'sergio@gmail.xxx')).to.throw(`invalid email`)
        })

    })

    !true && describe('validate date fields', () => {
        const dateOfMatch = new Date()
        it('should succeed on correct date', () => {
            expect(() => logic._validateDateField('date', dateOfMatch).to.equal(dateOfMatch))
        })

        it('should fail on undefined date', () => {
            expect(() => logic._validateDateField('date', undefined)).to.throw(`invalid date`)
        })

        it('should fail on empty date', () => {
            expect(() => logic._validateDateField('date', '')).to.throw(`invalid date`)
        })

        it('should fail on numeric date', () => {
            expect(() => logic._validateDateField('date', 123)).to.throw(`invalid date`)
        })

        it('should fail on string date', () => {
            expect(() => logic._validateDateField('date', '2018-08-30')).to.throw(`invalid date`)
        })

        it('should fail on wrong date', () => {
            expect(() => logic._validateDateField('date', `${dateOfMatch}a`)).to.throw(`invalid date`)
        })

    })

    // USER: register, authenticate, update and unregister

    !true && describe('register user', () => { // PERFECT
        it('should register correctly', () =>
            User.findOne({ email })
                .then(user => {
                    expect(user).to.be.null

                    return logic.register(email, password)
                })
                .then(res => {
                    expect(res).to.be.true

                    return User.findOne({ email })
                })
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.equal(email)
                    expect(user.password).to.equal(password)

                    return User.find()
                })
                .then(users => expect(users.length).to.equal(usersCount + 1))
        )

        it('should fail on trying to register with an existing user', () =>
            User.create({ email, password })
                .then(() => logic.register(email, password))
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The user with email ${email} already exists on database`))
        )

        it('should fail on trying to register with an undefined email', () =>
            logic.register(undefined, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid email'))
        )

        it('should fail on trying to register with an empty email', () =>
            logic.register('', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid email'))
        )

        it('should fail on trying to register with a numeric email', () =>
            logic.register(123, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid email'))
        )

        it('should fail on trying to register with an undefined password', () =>
            logic.register(email, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid password'))
        )

        it('should fail on trying to register with an empty password', () =>
            logic.register(email, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid password'))
        )

        it('should fail on trying to register with a numeric password', () =>
            logic.register(email, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid password'))
        )

        it('should fail on trying to register with a very short password', () =>
            logic.register(email, '123')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('User validation failed: password: The password length is too short'))
        )
    })

    !true && describe('authenticate user', () => { // PERFECT
        beforeEach(() => User.create({ email, password }))
        let userid
        it('should authenticate correctly', () => {
            return User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.be.equal(email)
                    expect(user.password).to.be.equal(password)
                    userid = user._id.toString()
                    return logic.authenticate(email, password)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.id).to.exist
                    expect(userid).to.deep.equal(res.toString())
                })
        })

        it('should fail on trying to login with an undefined email', () =>
            logic.authenticate(undefined, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid email`))
        )

        it('should fail on trying to login with an empty email', () =>
            logic.authenticate('', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid email`))
        )

        it('should fail on trying to login with a numeric email', () =>
            logic.authenticate(123, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid email`))
        )

        it('should fail on trying to login with an unregistered user', () =>
            logic.authenticate('eduberenguer@gmail.com', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('The user with email eduberenguer@gmail.com does not exist on database'))
        )

        it('should fail on trying to login with an undefined password', () =>
            logic.authenticate(email, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid password`))
        )

        it('should fail on trying to login with an empty password', () =>
            logic.authenticate(email, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid password`))
        )

        it('should fail on trying to login with a numeric password', () =>
            logic.authenticate(email, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid password`))
        )
        it('should fail on trying to login with a wrong password', () =>
            logic.authenticate(email, `${password}a`)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The password is wrong`))
        )
    })

    !true && describe('update password', () => { // PERFECT
        beforeEach(() => User.create({ email, password }))
        const newPassword = '654321'
        let id
        it('should update the password correctly with the correct password and fail with an uncorrect password', () => {
            return User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.be.equal(email)
                    expect(user.password).to.be.equal(password)
                    id = user._id.toString()
                    return logic.updatePassword(id, password, newPassword)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res).to.be.true
                    return User.findOne({ '_id': id })
                })
                .then(user => {
                    expect(user).to.exist
                    expect(user.password).to.be.equal(newPassword)
                    return logic.updatePassword(id, password, newPassword)
                })
                .catch(err => err)
                .then(({ message }) => {
                    expect(message).to.exist
                    expect(message).to.be.equal(`The password ${password} is wrong`)
                })
        })
        it('should fail on trying to update with an undefined id', () =>
            logic.updatePassword(undefined, password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid id`))
        )
        it('should fail on trying to update with an empty id', () =>
            logic.updatePassword('', password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid id`))
        )
        it('should fail on trying to update with a numeric id', () =>
            logic.updatePassword(123456789, password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid id`))
        )
        it('should fail on trying to update with an undefined password', () =>
            logic.updatePassword(id, undefined, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid password`))
        )
        it('should fail on trying to update with an empty password', () =>
            logic.updatePassword(id, '', newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid password`))
        )
        it('should fail on trying to update with a numeric password', () =>
            logic.updatePassword(id, 123456789, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid password`))
        )
        it('should fail on trying to update with an undefined new password', () =>
            logic.updatePassword(id, password, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid new password`))
        )
        it('should fail on trying to update with an empty new password', () =>
            logic.updatePassword(id, password, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid new password`))
        )
        it('should fail on trying to update with a numeric new password', () =>
            logic.updatePassword(id, password, 123456789)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid new password`))
        )

    })

    !true && describe('unregister user', () => { // PERFECT
        beforeEach(() => User.create({ email, password }))
        let id
        const password2 = '654321'
        it('should unregister the user correctly with correct password and fail with a wrong password', () => {
            return User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.be.equal(email)
                    expect(user.password).to.be.equal(password)
                    id = user._id.toString()
                    return logic.unregister(id, password2)
                })
                .catch(({ message }) => {
                    expect(message).to.exist
                    expect(message).to.be.equal(`The password ${password2} is wrong`)
                    return logic.unregister(id, password)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res).to.be.true
                    return User.findOne({ '_id': id })
                })
                .then(user => {
                    expect(user).not.to.exist
                })
        })
        it('should fail on trying to unregister user with an undefined id', () =>
            logic.unregister(undefined, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid id`))
        )
        it('should fail on trying to unregister user with an empty id', () =>
            logic.unregister('', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid id`))
        )
        it('should fail on trying to unregister user with a numeric id', () =>
            logic.unregister(123456789, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid id`))
        )
        it('should fail on trying to unregister user with an undefined password', () =>
            logic.unregister(id, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid password`))
        )
        it('should fail on trying to unregister user with an empty password', () =>
            logic.unregister(id, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid password`))
        )
        it('should fail on trying to unregister user with a numeric password', () =>
            logic.unregister(id, 123456789)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`This is an invalid password`))
        )
    })

    // PLAYER: Add user as a player, retrieve user roles, retrieve player data, list my teams as a player, list my tournaments as a player and remove the player role

    !true && describe('add user as a player', () => { // PERFECT
        beforeEach(() => User.create({ email, password, role: ['manager'] }))
        it('should add this user as a player correctly', () => {
            return User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    id = user.id
                    return logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                })
                .then(res => {
                    expect(res).to.be.true
                    return User.findOne({ email })
                })
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.equal(email)
                    expect(user.password).to.equal(password)
                    expect(user.dni).to.equal(dni)
                    expect(user.name).to.equal(name)
                    expect(user.surname).to.equal(surname)
                    expect(user.age).to.equal(age)
                    expect(user.gender).to.equal(gender)
                    expect(user.height).to.equal(height)
                    expect(user.weight).to.equal(weight)
                    expect(user.position).to.equal(position)
                    expect(user.squadNumber).to.equal(squadNumber)
                    expect(user.photo).to.equal(photo)
                    expect(user.role).to.deep.equal(['manager', 'player'])
                })
        })

        it('should fail on trying to add an user as a player with an undefined id', () =>
            logic.iWantToBeAPlayer(undefined, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to add an user as a player with an empty id', () =>
            logic.iWantToBeAPlayer('', dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to add an user as a player with a numeric id', () =>
            logic.iWantToBeAPlayer(2347594032, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to add an user as a player with an id that belongs to nobody', () =>
            logic.iWantToBeAPlayer(id2, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The user with id ${id2} does not exists on database`))
        )

        it('should fail on trying to add an user as a player with a wrong id', () =>
            logic.iWantToBeAPlayer('sfd343f34f343f', dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('Cast to ObjectId failed for value "sfd343f34f343f" at path "_id" for model "User"'))
        )

        it('should fail on trying to add an user as a player with an undefined dni', () =>
            logic.iWantToBeAPlayer(id, undefined, name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid dni'))
        )

        it('should fail on trying to add an user as a player with an empty dni', () =>
            logic.iWantToBeAPlayer(id, '', name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid dni'))
        )

        it('should fail on trying to add an user as a player with a wrong dni', () =>
            logic.iWantToBeAPlayer(id, '5291673N', name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The dni 5291673N is not a correct dni`))
        )

        it('should fail on trying to add an user as a player with an undefined name', () =>
            logic.iWantToBeAPlayer(id, dni, undefined, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid name'))
        )

        it('should fail on trying to add an user as a player with an empty name', () =>
            logic.iWantToBeAPlayer(id, dni, '', surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid name'))
        )

        it('should fail on trying to add an user as a player with a numeric name', () =>
            logic.iWantToBeAPlayer(id, dni, 123, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid name'))
        )

        it('should fail on trying to add an user as a player with an undefined surname', () =>
            logic.iWantToBeAPlayer(id, dni, name, undefined, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid surname'))
        )

        it('should fail on trying to add an user as a player with an empty surname', () =>
            logic.iWantToBeAPlayer(id, dni, name, '', age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid surname'))
        )

        it('should fail on trying to add an user as a player with a numeric surname', () =>
            logic.iWantToBeAPlayer(id, dni, name, 123, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid surname'))
        )

        it('should fail on trying to add an user as a player with an undefined age', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, undefined, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid age'))
        )

        it('should fail on trying to add an user as a player with an empty age', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid age'))
        )

        it('should fail on trying to add an user as a player with an incorrect age to play', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, 90, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an inadequate age'))
        )

        it('should fail on trying to add an user as a player with an string age', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, '37', gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid age'))
        )

        it('should fail on trying to add an user as a player with an undefined gender', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, undefined, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid gender'))
        )

        it('should fail on trying to add an user as a player with an empty gender', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, '', height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid gender'))
        )

        it('should fail on trying to add an user as a player with a numeric gender', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, 123, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid gender'))
        )

        it('should fail on trying to add an user as a player with an wrong accepted gender', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, 'shemale', height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid gender'))
        )

        it('should fail on trying to add an user as a player with an undefined height', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, undefined, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid height'))
        )

        it('should fail on trying to add an user as a player with an empty height', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, '', weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid height'))
        )

        it('should fail on trying to add an user as a player with a string height', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, '173', weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid height'))
        )

        it('should fail on trying to add an user as a player with an incorrect height', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, 260, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an inadequate height'))
        )

        it('should fail on trying to add an user as a player with an undefined weight', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, undefined, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid weight'))
        )

        it('should fail on trying to add an user as a player with an empty weight', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, '', position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid weight'))
        )

        it('should fail on trying to add an user as a player with a string weight', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, '72', position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid weight'))
        )

        it('should fail on trying to add an user as a player with an incorrect weight', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, 140, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an inadequate weight'))
        )

        it('should fail on trying to add an user as a player with an undefined position', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, undefined, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid position'))
        )

        it('should fail on trying to add an user as a player with an empty position', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, '', squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid position'))
        )

        it('should fail on trying to add an user as a player with a numeric position', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, 123, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid position'))
        )

        it('should fail on trying to add an user as a player with an undefined squad number', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, undefined, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid squad number'))
        )

        it('should fail on trying to add an user as a player with an empty squad number', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, '', photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid squad number'))
        )

        it('should fail on trying to add an user as a player with a string squad number', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, '4', photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid squad number'))
        )

        it('should fail on trying to add an user as a player with an incorrect squad number', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, 100, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an inadequate squad number'))
        )

        it('should fail on trying to add an user as a player with an undefined photo link', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, squadNumber, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid photo'))
        )

        it('should fail on trying to add an user as a player with an empty photo link', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, squadNumber, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid photo'))
        )

        it('should fail on trying to add an user as a player with a numeric photo link', () =>
            logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, squadNumber, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid photo'))
        )

    })

    !true && describe('retrieve user roles', () => { // PERFECT
        beforeEach(() => User.create({ email, password, role: 'player', dni, name, surname, age, gender, height, weight, position, squadNumber, photo }))
        it('should retrieve the player information correctly', () =>
            User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role).to.deep.equal(["player"])
                    id = user.id
                    return logic.retrieveUserRoles(id)
                })
                .then(roles => {
                    expect(roles).to.exist
                    expect(roles[0]).to.be.equal('player')
                })
        )
        it('should fail on trying to retrieve a player data with an undefined id', () =>
            logic.retrieveUserRoles(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to retrieve a player data with an empty id', () =>
            logic.retrieveUserRoles('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to retrieve a player data with a numeric id', () =>
            logic.retrieveUserRoles(12345)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to retrieve a player data with a wrong id', () =>
            logic.retrieveUserRoles(id2)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The user with id ${id2} not exists on database`))
        )
    })

    !true && describe('retrieve the player information', () => { // TODO: LOOK FOR MORE TESTS
        beforeEach(() => User.create({ email, password, role: 'player', dni, name, surname, age, gender, height, weight, position, squadNumber, photo }))
        it('should retrieve the player information correctly', () =>
            User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role).to.deep.equal(["player"])
                    id = user.id
                    return logic.retrievePlayer(id)
                })
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.equal(email)
                    expect(user.dni).to.equal(dni)
                    expect(user.name).to.equal(name)
                    expect(user.surname).to.equal(surname)
                    expect(user.age).to.equal(age)
                    expect(user.gender).to.equal(gender)
                    expect(user.height).to.equal(height)
                    expect(user.weight).to.equal(weight)
                    expect(user.position).to.equal(position)
                    expect(user.squadNumber).to.equal(squadNumber)
                    expect(user.photo).to.equal(photo)
                })
        )

        it('should fail on trying to take out an user as a player with an undefined id', () =>
            logic.iDontWantToBeAPlayer(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to take out an user as a player with an empty email', () =>
            logic.iDontWantToBeAPlayer('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to take out an user as a player with a numeric id', () =>
            logic.iDontWantToBeAPlayer(123456)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to take out an user as a player with a non existing id', () =>
            logic.iDontWantToBeAPlayer(id2)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The user with id ${id2} does not exists on database`))
        )

    })

    !true && describe('list my teams as player', () => { // PERFECT
        const teamName = 'FC Barcelona'
        const description = 'Equipo de prueba'
        const owner = 'Sergio Castillo'
        beforeEach(() =>
            User.create({ email, password, role: ['player'], dni, name, surname, age, gender, height, weight, position, squadNumber, photo })
                .then(res => {
                    id = res.id
                    return Team.create({ name: teamName, description, owner, manager: id, squad: [id] })
                })
                .then(res => {
                    teamId = res.id
                })
        )
        it('should list all the teams information correctly', () =>
            logic.listMyTeamsAsPlayer(id)
                .then(teams => {
                    expect(teams).to.exist
                    expect(teams.length).to.be.equal(1)
                    expect(teams[0].name).to.be.equal(teamName)
                })
        )
        it('should fail on trying to list all teams from a player with an undefined id', () =>
            logic.listMyTeamsAsPlayer(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to list all teams from a player with an empty id', () =>
            logic.listMyTeamsAsPlayer('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to list all teams from a player with a numeric id', () =>
            logic.listMyTeamsAsPlayer(123456)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to list all teams from a player with a non existing id', () =>
            logic.listMyTeamsAsPlayer(id2)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The user with id ${id2} does not exists on database`))
        )
    })

    !true && describe('list my tournaments as player', () => { // PERFECT
        const teamName = 'FC Barcelona'
        const description = 'Equipo de prueba'
        const owner = 'Sergio Castillo'
        const nameTournament = 'Skylab Tournament'
        let teamId
        beforeEach(() =>
            User.create({ email, password, role: ['player'], dni, name, surname, age, gender, height, weight, position, squadNumber, photo })
                .then(res => {
                    id = res.id
                    return Team.create({ name: teamName, description, owner, manager: id, squad: [id] })
                })
                .then(res => {
                    teamId = res.id
                    return Tournament.create({ nameTournament, organizer: id, teams: [teamId] })
                })
        )
        it('should list all the tournaments as a player correctly', () =>
            logic.listMyTournamentsAsPlayer(id, teamId)
                .then(tournaments => {
                    expect(tournaments).to.exist
                    expect(tournaments.length).to.be.equal(1)
                    expect(tournaments[0].teams.length).to.be.equal(1)
                    expect(tournaments[0].teams[0].toString()).to.be.equal(teamId)
                })
        )
        it('should fail on trying to list all tournaments from a player with an undefined id', () =>
            logic.listMyTournamentsAsPlayer(undefined, teamId)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to list all tournaments from a player with an empty email', () =>
            logic.listMyTournamentsAsPlayer('', teamId)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to list all tournaments from a player with a numeric id', () =>
            logic.listMyTournamentsAsPlayer(123456, teamId)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to list all tournaments from a player with a non existing id', () =>
            logic.listMyTournamentsAsPlayer(id2, teamId)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The user with id ${id2} does not exists on database`))
        )
        it('should fail on trying to list all tournaments from a player with an undefined team id', () =>
            logic.listMyTournamentsAsPlayer(id, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to list all tournaments from a player with an empty team id', () =>
            logic.listMyTournamentsAsPlayer(id, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to list all tournaments from a player with a numeric id', () =>
            logic.listMyTournamentsAsPlayer(id, 123456)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
    })

    !true && describe('remove the player role', () => { // PERFECT
        beforeEach(() => User.create({ email, password, role: ['player', 'manager'] }))
        let id
        const id2 = new ObjectId().toString()
        it('should remove the player role of this user correctly', () =>
            User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role).to.deep.equal(['player', 'manager'])
                    id = user.id
                    return logic.iDontWantToBeAPlayer(id)
                })
                .then(res => {
                    expect(res).to.be.true
                    return User.findOne({ '_id': id })
                })
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.equal(email)
                    expect(user.password).to.equal(password)
                    expect(user.role).to.deep.equal(['manager'])
                    expect(user.dni).to.be.undefined
                    expect(user.name).to.be.undefined
                    expect(user.surname).to.be.undefined
                    expect(user.age).to.be.undefined
                    expect(user.gender).to.be.undefined
                    expect(user.height).to.be.undefined
                    expect(user.weight).to.be.undefined
                    expect(user.position).to.be.undefined
                    expect(user.squadNumber).to.be.undefined
                    expect(user.photo).to.be.undefined
                })
        )

        it('should fail on trying to take out an user as a player with an undefined id', () =>
            logic.iDontWantToBeAPlayer(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to take out an user as a player with an empty email', () =>
            logic.iDontWantToBeAPlayer('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to take out an user as a player with a numeric id', () =>
            logic.iDontWantToBeAPlayer(123456)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to take out an user as a player with a non existing id', () =>
            logic.iDontWantToBeAPlayer(id2)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The user with id ${id2} does not exists on database`))
        )

    })

    // TEAM

    !true && describe('create a team', () => { // PERFECT
        const email2 = 'javilopez@gmail.com'
        const name = 'F.C. Birralona'
        const description = 'Equipo de fútbol sala de la peña Despenyats'
        const owner = 'Sergio Castillo'
        let id
        beforeEach(() => User.create([{ email, password }, { email: email2, password, role: 'manager' }]))

        it('should create a team correctly', () =>
            User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role).not.to.deep.equal(['manager'])
                    id = user.id
                    return logic.createTeam(id, name, description, owner)
                })
                .then(res => {
                    expect(res).to.be.true
                    return User.findOne({ '_id': id })
                })
                .then(user => {
                    expect(user.role).to.deep.equal(['manager'])
                    return Team.findOne({ name })
                })
                .then(team => {
                    expect(team).to.exist
                    expect(team.name).to.equal(name)
                    expect(team.description).to.equal(description)
                    expect(team.owner).to.equal(owner)
                })
        )

        it('should create a team correctly with an user with other teams', () =>
            User.findOne({ email: email2 })
                .then(user => {
                    id = user.id
                    expect(user).to.exist
                    expect(user.role).to.deep.equal(['manager'])
                    return logic.createTeam(id, name, description, owner)
                })
                .then(res => {
                    expect(res).to.be.true
                    return User.findOne({ '_id': id })
                })
                .then(user => {
                    expect(user.role).to.deep.equal(['manager'])
                    return Team.findOne({ name })
                })
                .then(team => {
                    expect(team).to.exist
                    expect(team.name).to.equal(name)
                    expect(team.description).to.equal(description)
                    expect(team.owner).to.equal(owner)
                    return logic.createTeam(id, name, description, owner)
                })
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The team name ${name} already exists on database`))
        )

        it('should fail on trying to create a team with an undefined name', () =>
            logic.createTeam(id, undefined, description, owner)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid name'))
        )

        it('should fail on trying to create a team with an empty name', () =>
            logic.createTeam(id, '', description, owner)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid name'))
        )

        it('should fail on trying to create a team with a numeric name', () =>
            logic.createTeam(id, 123, description, owner)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid name'))
        )

        it('should fail on trying to create a team with an undefined description', () =>
            logic.createTeam(id, name, undefined, owner)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid description'))
        )

        it('should fail on trying to create a team with an empty description', () =>
            logic.createTeam(id, name, '', owner)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid description'))
        )

        it('should fail on trying to create a team with a numeric description', () =>
            logic.createTeam(id, name, 123, owner)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid description'))
        )

        // TODO The error if the description is more than 250 letters

        it('should fail on trying to create a team with an undefined owner', () =>
            logic.createTeam(id, name, description, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid owner'))
        )

        it('should fail on trying to create a team with an empty owner', () =>
            logic.createTeam(id, name, description, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid owner'))
        )

        it('should fail on trying to create a team with a numeric owner', () =>
            logic.createTeam(id, name, description, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid owner'))
        )

    })

    !true && describe('list my teams as manager', () => { // PERFECT
        const email2 = 'javilopez@gmail.com'
        const name = 'F.C. Birralona'
        const name2 = 'Atletico Fuertaco'
        const description = 'Equipo de fútbol sala de la peña Despenyats'
        const owner = 'Sergio Castillo'
        let id
        beforeEach(() => {
            return User.create([{ email, password, role: 'manager' }, { email: email2, password, role: 'manager' }])
                .then(() => {
                    return User.findOne({ email })
                        .then(user => {
                            id = user.id
                            Team.create([{ name, description, owner, manager: id }, { id, name: name2, description, owner, manager: id }])
                        })
                })
        })

        it('should list all my teams as manager correctly', () =>
            User.findOne({ '_id': id })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role[0]).to.deep.equal('manager')
                    return logic.listMyTeamsAsManager(id)
                })
                .then(teams => {
                    expect(teams).to.exist
                    expect(teams.length).to.equal(2)
                    expect(teams[0].name).to.equal(name)
                    expect(teams[0].description).to.equal(description)
                    expect(teams[1].name).to.equal(name2)
                    expect(teams[1].description).to.equal(description)
                })
        )
        it('should fail on trying to list my teams as manager with an undefined id', () =>
            logic.listMyTeamsAsManager(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to list my teams as manager with an empty id', () =>
            logic.listMyTeamsAsManager('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to list my teams as manager with a numeric id', () =>
            logic.listMyTeamsAsManager(1234567)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to list my teams as manager with a wrong id', () =>
            logic.listMyTeamsAsManager(id2)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The user with id ${id2} does not exists on database`))
        )
    })

    !true && describe('retrieve team data', () => {
        const email2 = 'javilopez@gmail.com'
        const name = 'F.C. Birralona'
        const name2 = 'Atletico Fuertaco'
        const description = 'Equipo de fútbol sala de la peña Despenyats'
        const owner = 'Sergio Castillo'
        let teamId
        beforeEach(() => {
            return User.create([{ email, password, role: 'manager' }, { email: email2, password, role: 'manager' }])
                .then(() => {
                    return User.findOne({ email })
                        .then(user => {
                            id = user.id
                            return Team.create([{ name, description, owner, manager: id }, { id, name: name2, description, owner, manager: id }])
                        })
                        .then(teams => {
                            teamId = teams[0].id
                        })
                })
        })

        it('should retrieve team data correctly', () =>
            User.findOne({ '_id': id })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role[0]).to.deep.equal('manager')
                    return logic.retrieveTeamData(id, teamId)
                })
                .then(team => {
                    expect(team).to.exist

                    expect(team.name).to.equal(name)
                    expect(team.description).to.equal(description)
                    expect(team.owner).to.equal(owner)
                })
        )
    })

    !true && describe('list players from team', () => {
        let id, id2, id3, teamId
        const email2 = `FC${Math.random()}@gmail.com`
        const email3 = `Royo${Math.random()}@gmail.com`
        const dni2 = '53144765R'
        const name = `RD${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }, { email: email2, password, role: 'player', dni, name, surname, age, gender, height, weight, position, squadNumber, photo }, { email: email3, password, role: ['player'], dni: dni2, name, surname, age, gender, height, weight, position, squadNumber, photo }])
                .then(res => {
                    id = res[0].id
                    id2 = res[1].id
                    id3 = res[2].id
                    return Team.create([{ name, description, owner, manager: id, squad: [id2, id3] }])
                })
                .then(team => {
                    teamId = team[0].id
                })

        })
        it('should list players from team correctly', () =>
            logic.listPlayersFromTeam(id, teamId)
                .then(res => {
                    expect(res).to.exist
                })
        )
    })

    !true && describe('remove team', () => {
        const email2 = 'eduberenguer@gmail.com'
        const email3 = 'javirrim@gmail.com'
        const name = 'F.C.Birralona'
        const description = 'Esto es un equipo de prueba'
        const owner = 'Sergio Castillo'
        let id, teamid
        beforeEach(() => {
            const users = [{ email, password, role: 'manager' }, { email: email2, password }, { email: email3, password }]
            return User.create(users)
                .then(res => Team.create({ name, description, owner, manager: res[0]._id }))
        })
        it('should remove the team correctly', () =>
            User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role).to.deep.equal(['manager'])
                    id = user.id
                    return Team.findOne({ name })
                })
                .then(team => {
                    expect(team).to.exist
                    expect(team.name).to.be.equal(name)
                    expect(team.description).to.be.equal(description)
                    expect(team.owner).to.be.equal(owner)
                    teamid = team.id
                    return logic.removeTeam(id, teamid)
                })
                .then(res => {
                    expect(res).to.be.true
                })
        )
        it('should fail on trying to remove a team with an undefined id', () =>
            logic.removeTeam(undefined, teamid)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to remove a team with an empty id', () =>
            logic.removeTeam('', teamid)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to remove a team with a numeric id', () =>
            logic.removeTeam(1224234, teamid)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to remove a team with an undefined team id', () =>
            logic.removeTeam(id, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to remove a team with an empty team id', () =>
            logic.removeTeam(id, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on trying to remove a team with a numeric team id', () =>
            logic.removeTeam(id, 1231231)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
    })

    !true && describe('search player by query: name, surname or dni', () => {
        const email2 = 'javilopez@gmail.com'
        const dni2 = '36777876R'
        let id2
        beforeEach(() => {
            return User.create([{ email, password, role: ['player', 'manager'], dni }, { email: email2, password, role: ['player'], dni: dni2 }])
                .then(res => {
                    id = res[0].id
                    id2 = res[1].id
                })
        })
        it('should find a player by dni correctly', () =>
            logic.searchPlayersByQuery(id, undefined, undefined, dni)
                .then(user => {
                    expect(user).to.exist
                    expect(user[0].dni).to.be.equal(dni)
                })
        )
        it('should fail on find a player with an undefined id', () =>
            logic.removeTeam(undefined, undefined, undefined, dni)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on find a player with an empty id', () =>
            logic.removeTeam('', undefined, undefined, dni)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
        it('should fail on find a player with an empty id', () =>
            logic.removeTeam(123213, undefined, undefined, dni)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )
    })

    !true && describe('add player to team', () => {
        const email2 = 'javilopez@gmail.com'
        const name = 'F.C. Birralona'
        const description = 'Equipo de fútbol sala de la peña Despenyats'
        const owner = 'Sergio Castillo'
        let id, playerId, teamId
        beforeEach(() => {
            return User.create([{ email, password, role: 'manager' }, { email: email2, password, role: 'player' }])
                .then(res => {
                    id = res[0].id
                    playerId = res[1].id
                    return Team.create({ name, description, owner, manager: id, squad: [id] })
                })
                .then(res => {
                    teamId = res.id
                })
        })
        it('should add a player to a team correctly', () =>
            logic.addPlayerToTeam(id, teamId, playerId)
                .then(res => {
                    expect(res).to.be.true
                    return Team.findOne({ '_id': teamId })
                })
                .then(team => {
                    expect(team).to.exist
                    expect(team.squad[0]).to.exist
                    expect(team.squad[0].toString()).to.be.equal(id)
                    expect(team.squad[1].toString()).to.be.equal(playerId)
                })

        )
        it('should fail if player already exists in this team', () =>
            logic.addPlayerToTeam(id, teamId, playerId)
                .then(res => {
                    expect(res).to.be.true
                    return logic.addPlayerToTeam(id, teamId, playerId)
                })
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`The player with id ${playerId} already exists in this team`))

        )
    })

    !true && describe('remove player from team', () => {
        let id, id2, id3, teamId
        const email2 = `FC${Math.random()}@gmail.com`
        const email3 = `Royo${Math.random()}@gmail.com`
        const dni2 = '53144765R'
        const name = `RD${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }, { email: email2, password, role: 'player', dni, name, surname, age, gender, height, weight, position, squadNumber, photo }, { email: email3, password, role: ['player'], dni: dni2, name, surname, age, gender, height, weight, position, squadNumber, photo }])
                .then(res => {
                    id = res[0].id
                    id2 = res[1].id
                    id3 = res[2].id
                    return Team.create([{ name, description, owner, manager: id, squad: [id2, id3] }])
                })
                .then(team => {
                    teamId = team[0].id
                })

        })
        it('should list players from team correctly', () =>
            logic.removePlayerFromATeam(id, teamId, id2)
                .then(res => {
                    expect(res).to.exist
                })
        )
    })



    // TOURNAMENTS

    !true && describe('create tournament', () => {
        const nameTournament = 'Skylab Tournament'
        const nameTournament2 = 'Liga BBVA'
        const nameTournament3 = 'Premier League'
        const email2 = 'jaume@gmail.com'
        const email3 = 'gerard@gmail.com'
        let id, id2, id3
        beforeEach(() => {
            const users = [{ email, password }, { email: email2, password }, { email: email3, password }]
            return User.create(users)
                .then(res => {
                    id = res[0].id
                    id2 = res[1].id
                    id3 = res[2].id
                })
        })
        it('should create a tournament correctly', () =>
            logic.createTournament(id, nameTournament)
                .then(res => {
                    expect(res).to.be.true
                    return User.findOne({ '_id': id })
                })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role[0]).to.be.equal('organizer')
                    return Tournament.findOne({ nameTournament })
                })
                .then(tournament => {
                    expect(tournament).to.exist
                    expect(tournament.nameTournament).to.equal(nameTournament)
                    expect(tournament.state).to.be.equal('creating')
                })
        )
        // it('should create some tournaments correctly', () =>
        //     logic.createTournament(email, password, nameTournament)
        //         .then(res => {
        //             expect(res).to.be.true
        //             return logic.createTournament(email2, password, nameTournament2)
        //         })
        //         .then(res => {
        //             expect(res).to.be.true
        //             return logic.createTournament(email3, password, nameTournament3)
        //         })
        //         .then(res => {
        //             expect(res).to.be.true
        //             return User.findOne({ email })
        //         })
        //         .then(user => {
        //             expect(user.role[0]).to.be.equal('organizer')
        //             id = user._id
        //             return User.findOne({ email: email2 })
        //         })
        //         .then(user => {
        //             expect(user.role[0]).to.be.equal('organizer')
        //             console.log(user.userid)
        //             id2 = user._id
        //             return User.findOne({ email: email3 })
        //         })
        //         .then(user => {
        //             expect(user.role[0]).to.be.equal('organizer')
        //             id3 = user._id
        //             return Tournament.find()
        //         })
        //         .then(tournaments => {
        //             expect(tournaments).to.exist
        //             expect(tournaments.length).to.equal(3)
        //             expect(tournaments[0].nameTournament).to.be.equal(nameTournament)
        //             expect(tournaments[0].organizer).to.deep.equal(id) // ASK MANU ABOUT THIS ONE
        //             expect(tournaments[1].nameTournament).to.be.equal(nameTournament2)
        //             expect(tournaments[1].organizer).to.deep.equal(id2) // ASK MANU ABOUT THIS ONE
        //             expect(tournaments[2].nameTournament).to.be.equal(nameTournament3)
        //             expect(tournaments[2].organizer).to.deep.equal(id3) // ASK MANU ABOUT THIS ONE
        //         })
        // )

        // it('should fail on trying to create a tournament with an undefined tournament name', () =>
        //     logic.createTournament(email, password, undefined)
        //         .catch(err => err)
        //         .then(({ message }) => expect(message).to.equal('This is an invalid tournament name'))
        // )

        // it('should fail on trying to create a tournament with an empty tournament name', () =>
        //     logic.createTournament(email, password, '')
        //         .catch(err => err)
        //         .then(({ message }) => expect(message).to.equal('This is an invalid tournament name'))
        // )

        // it('should fail on trying to create a tournament with a numeric tournament name', () =>
        //     logic.createTournament(email, password, 123)
        //         .catch(err => err)
        //         .then(({ message }) => expect(message).to.equal('This is an invalid tournament name'))
        // )

        // it('should fail on trying to create a tournament with an unregistered user', () =>
        //     logic.createTournament('javilopez@gmail.com', password, nameTournament)
        //         .catch(err => err)
        //         .then(({ message }) => expect(message).to.equal('The user with email javilopez@gmail.com not exists on database'))
        // )

        // it('should fail on trying to create a tournament with a wrong password', () =>
        //     logic.createTournament(email, '654321', nameTournament)
        //         .catch(err => err)
        //         .then(({ message }) => expect(message).to.equal('Wrong password'))
        // )


    })

    !true && describe('list all the organizer tournaments', () => {
        const email2 = 'javilopez@gmail.com'
        const nameTournament = 'La Liga de Skylab'
        const nameTournament2 = 'Pichis in the sky'
        let id
        beforeEach(() => {
            return User.create([{ email, password, role: 'organizer' }, { email: email2, password, role: 'manager' }])
                .then(() => {
                    return User.findOne({ email })
                        .then(user => {
                            id = user.id
                            Tournament.create([{ nameTournament, organizer: id }, { nameTournament: nameTournament2, organizer: id }])
                        })
                })
        })

        it('should list all the tournaments correctly', () =>
            User.findOne({ '_id': id })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role[0]).to.deep.equal('organizer')
                    return logic.listMyTournamentsAsOrganizer(id)
                })
                .then(tournaments => {
                    expect(tournaments).to.exist
                    expect(tournaments.length).to.equal(2)
                    expect(tournaments[0].name).to.equal(nameTournament)
                    expect(tournaments[1].name).to.equal(nameTournament2)
                })
        )
    })

    !true && describe('list all teams as organizer', () => {
        const email2 = 'javilopez@gmail.com'
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}CF`
        const description = 'Equipo de fútbol sala de la peña Despenyats'
        const owner = 'Sergio Castillo'
        let id, id2
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }, { email: email2, password, role: 'manager' }])
                .then(res => {
                    id = res[0].id
                    id2 = res[1].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id2 }])
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.length).to.be.equal(2)
                })
        })

        it('should list all teams correctly', () => {
            return logic.listAllTeamsAsOrganizer(id)
                .then(teams => {
                    expect(teams).to.exist
                    expect(teams.length).to.be.equal(2)
                })

        })

        // it('should create a team correctly', () =>
        //     // User.findOne({ email })
        //     //     .then(user => {
        //     //         expect(user).to.exist
        //     //         expect(user.role)to.deep.equal(['manager'])
        //     //         id = user.id
        //     //         return Team.createTeam(id, name, description, owner)
        //     //     })
        //         // .then(res => {
        //         //     expect(res).to.be.true
        //         //     return User.findOne({ email:email2 })
        //         // })
        //         // .then(user => {
        //         //     expect(user).to.exist
        //         //     expect(user.role).not.to.deep.equal(['manager'])
        //         //     id = user.id
        //         //     expect(user.role).to.deep.equal(['manager'])
        //         //     return Team.findOne({ name })
        //         // })
        //         // .then(team => {
        //         //     expect(team).to.exist
        //         //     expect(team.name).to.equal(name)
        //         //     expect(team.description).to.equal(description)
        //         //     expect(team.owner).to.equal(owner)
        //         // })
        // )

    })

    !true && describe('Add team to tournament', () => {
        let id, teamId, team2Id, tournamentId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id }])
                })
                .then(teams => {
                    teamId = teams[0].id
                    team2Id = teams[1].id
                    return Tournament.create({ nameTournament, organizer: id })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                })
        })
        it('should add team to tournament correctly', () =>
            logic.addTeamToTournament(id, tournamentId, teamId)
                .then(res => {
                    expect(res).to.exist
                    return Tournament.findOne({ '_id': tournamentId })
                })
                .then(tournament => {
                    expect(tournament).to.exist
                    expect(tournament.teams.length).to.be.equal(1)
                    expect(tournament.teams[0]._id.toString()).to.be.equal(teamId)
                })
        )
    })

    !true && describe('Retrieve tournament data', () => {
        let id, teamId, team2Id, tournamentId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id }])
                })
                .then(teams => {
                    teamId = teams[0].id
                    team2Id = teams[1].id
                    return Tournament.create({ nameTournament, organizer: id, teams: [teamId, team2Id], state: 'playing' })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                })
        })
        it('should retrieve tournament data correctly', () =>
            logic.retrieveTournamentData(id, tournamentId)
                .then(tournament => {
                    expect(tournament).to.exist
                    expect(tournament.teams.length).to.be.equal(2)
                    expect(tournament.teams[0]._id.toString()).to.be.equal(teamId)
                    expect(tournament.teams[1]._id.toString()).to.be.equal(team2Id)
                    expect(tournament.state = 'playing')
                })
        )
    })

    !true && describe('list teams from tournament', () => {
        let id, teamId, team2Id, tournamentId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id }])
                })
                .then(teams => {
                    teamId = teams[0].id
                    team2Id = teams[1].id
                    return Tournament.create({ nameTournament, organizer: id, teams: [teamId, team2Id], state: 'playing' })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                })
        })
        it('should list teams from tournament correctly', () =>
            logic.listTeamsFromTournament(id, tournamentId)
                .then(teams => {
                    expect(teams).to.exist
                    expect(teams.length).to.be.equal(2)
                    expect(teams[0].name).to.be.equal(name)
                    expect(teams[0].description).to.be.equal(description)
                    expect(teams[0].owner).to.be.equal(owner)
                    expect(teams[1].name).to.be.equal(name2)
                    expect(teams[1].description).to.be.equal(description)
                    expect(teams[1].owner).to.be.equal(owner)
                })
        )
    })

    !true && describe('start tournament', () => {
        let id, teamId, team2Id, tournamentId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id }])
                })
                .then(teams => {
                    teamId = teams[0].id
                    team2Id = teams[1].id
                    return Tournament.create({ nameTournament, organizer: id, teams: [teamId, team2Id] })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                })
        })
        it('should start tournament correctly', () =>
            logic.startTournament(id, tournamentId)
                .then(res => {
                    expect(res).to.exist
                    return Tournament.findOne({ '_id': tournamentId })
                })
                .then(tournament => {
                    expect(tournament).to.exist
                    expect(tournament.teams.length).to.be.equal(2)
                    expect(tournament.teams[0]._id.toString()).to.be.equal(teamId)
                    expect(tournament.teams[1]._id.toString()).to.be.equal(team2Id)
                    expect(tournament.state = 'playing')
                })
        )
    })

    !true && describe('create a new match', () => {
        let id, teamId, team2Id, tournamentId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id }])
                })
                .then(teams => {
                    teamId = teams[0].id
                    team2Id = teams[1].id
                    return Tournament.create({ nameTournament, organizer: id, teams: [teamId, team2Id], winners: [teamId, team2Id], state: 'playing' })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                })
        })
        it('should add team to tournament correctly', () =>
            logic.createNewMatch(id, tournamentId, teamId, team2Id)
                .then(res => {
                    expect(res).to.exist
                    return Tournament.findOne({ '_id': tournamentId })
                })
                .then(tournament => {
                    expect(tournament).to.exist
                    expect(tournament.teams.length).to.be.equal(2)
                    expect(tournament.teams[0]._id.toString()).to.be.equal(teamId)
                    expect(tournament.teams[1]._id.toString()).to.be.equal(team2Id)
                    expect(tournament.state = 'playing')
                })
        )
    })

    !true && describe('create new round of the tournament', () => {
        let id, teamId, team2Id, team3Id, team4Id, team5Id, team6Id, team7Id, team8Id, tournamentId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const name3 = `${Math.random()}R`
        const name4 = `${Math.random()}FCR`
        const name5 = `RCD${Math.random()}`
        const name6 = `RD${Math.random()}`
        const name7 = `A${Math.random()}`
        const name8 = `AM${Math.random()}`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id }, { name: name3, description, owner, manager: id }, { name: name4, description, owner, manager: id }, { name: name5, description, owner, manager: id }, { name: name6, description, owner, manager: id }, { name: name7, description, owner, manager: id }, { name: name8, description, owner, manager: id }])
                })
                .then(teams => {
                    teamId = teams[0].id
                    team2Id = teams[1].id
                    team3Id = teams[2].id
                    team4Id = teams[3].id
                    team5Id = teams[4].id
                    team6Id = teams[5].id
                    team7Id = teams[6].id
                    team8Id = teams[7].id
                    return Tournament.create({ nameTournament, organizer: id, teams: [teamId, team2Id, team3Id, team4Id, team5Id, team6Id, team7Id, team8Id], winners: [teamId, team2Id, team3Id, team4Id, team5Id, team6Id, team7Id, team8Id], state: 'playing' })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                })
        })
        it('should create a round correctly', () =>
            logic.createNewRound(id, tournamentId)
                .then(res => {
                    expect(res).to.exist
                    return Tournament.findOne({ '_id': tournamentId })
                })
                .then(tournament => {
                    expect(tournament).to.exist
                    expect(tournament.teams.length).to.be.equal(8)
                    expect(tournament.teams[0]._id.toString()).to.be.equal(teamId)
                    expect(tournament.teams[1]._id.toString()).to.be.equal(team2Id)
                    expect(tournament.state = 'playing')
                    expect(tournament.matches).to.exist
                    expect(tournament.matches.length).to.be.equal(4)

                })
        )
    })


    !true && describe('add a result of a match', () => {
        let id, teamId, team2Id, team3Id, team4Id, team5Id, team6Id, team7Id, team8Id, tournamentId, matchId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const name3 = `${Math.random()}R`
        const name4 = `${Math.random()}FCR`
        const name5 = `RCD${Math.random()}`
        const name6 = `RD${Math.random()}`
        const name7 = `A${Math.random()}`
        const name8 = `AM${Math.random()}`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        const goalsFirstTeam = 5
        const goalsSecondTeam = 3
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id }, { name: name3, description, owner, manager: id }, { name: name4, description, owner, manager: id }, { name: name5, description, owner, manager: id }, { name: name6, description, owner, manager: id }, { name: name7, description, owner, manager: id }, { name: name8, description, owner, manager: id }])
                })
                .then(teams => {
                    teamId = teams[0].id
                    team2Id = teams[1].id
                    team3Id = teams[2].id
                    team4Id = teams[3].id
                    team5Id = teams[4].id
                    team6Id = teams[5].id
                    team7Id = teams[6].id
                    team8Id = teams[7].id
                    return Tournament.create({ nameTournament, organizer: id, teams: [teamId, team2Id, team3Id, team4Id, team5Id, team6Id, team7Id, team8Id], winners: [teamId, team2Id], state: 'playing', roundMatches: 1 })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                    return Match.create({ teams: [teamId, team2Id] })
                })
                .then(match => {
                    matchId = match._id.toString()
                    return Tournament.findOne({ '_id': tournamentId })
                })
                .then(tournament => {
                    tournament.matches.push(matchId)
                })
        })
        it('should add a result correctly', () =>
            logic.addResult(id, tournamentId, matchId, goalsFirstTeam, goalsSecondTeam)
                .then(res => {
                    expect(res).to.exist

                })
        )
    })

    !true && describe('retrieve a match data', () => {
        let id, firstTeamId, secondTeamId, tournamentId, matchId, resultId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        const goalsFirstTeam = 5
        const goalsSecondTeam = 3
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id }])
                })
                .then(teams => {
                    firstTeamId = teams[0].id
                    secondTeamId = teams[1].id
                    return Result.create({ firstTeamId, secondTeamId, goalsFirstTeam, goalsSecondTeam })
                })
                .then(result => {
                    resultId= result.id
                    return Match.create({ teams: [firstTeamId, secondTeamId], result:[resultId] })
                })
                .then(match=>{
                    matchId=match.id
                    return Tournament.create({ nameTournament, organizer: id, teams: [firstTeamId, secondTeamId], winners: [firstTeamId], state: 'finish', roundMatches: 0, matches:[matchId] })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                    return true
                })
                
        })
        it('should retrieve a result correctly', () =>
            logic.retrieveMatch(id, matchId)
                .then(res => {
                    expect(res).to.exist

                })
        )
    })

    true && describe('retrieve a list of matches of a tournament data', () => {
        let id, firstTeamId, secondTeamId, team3Id, team4Id,tournamentId, matchId, match2Id,resultId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const name3 =`Athletic${Math.random()}`
        const name4 =`RealDeportivo${Math.random()}`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        const goalsFirstTeam = 5
        const goalsSecondTeam = 3
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id },{ name: name3, description, owner, manager: id }, { name: name4, description, owner, manager: id }])
                })
                .then(teams => {
                    firstTeamId = teams[0].id
                    secondTeamId = teams[1].id
                    team3Id = teams[2].id
                    team4Id = teams[3].id
                    return Result.create({ firstTeamId, secondTeamId, goalsFirstTeam, goalsSecondTeam })
                })
                .then(result => {
                    resultId= result.id
                    return Match.create({ teams: [firstTeamId, secondTeamId], result:[resultId] }, { teams: [team3Id, team4Id] })
                })
                .then(match=>{
                    matchId=match[0].id
                    match2Id=match[1].id
                    return Tournament.create({ nameTournament, organizer: id, teams: [firstTeamId, secondTeamId, team3Id, team4Id], winners: [firstTeamId, team3Id, team4Id], state: 'playing', roundMatches: 1, matches:[matchId, match2Id] })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                    return true
                })
                
        })
        it('should retrieve a list of matches correctly', () =>
            logic.listMatches(id, tournamentId)
                .then(res => {
                    expect(res).to.exist

                })
        )
    })

    !true && describe('Remove team from tournament', () => {
        let id, teamId, team2Id, tournamentId
        const name = `FC${Math.random()}`
        const name2 = `${Math.random()}FC`
        const nameTournament = `Skylab${Math.random()}`
        const description = 'Best World Team'
        const owner = 'Jesús Gil'
        beforeEach(() => {
            return User.create([{ email, password, role: ['organizer', 'manager'] }])
                .then(res => {
                    id = res[0].id
                    return Team.create([{ name, description, owner, manager: id }, { name: name2, description, owner, manager: id }])
                })
                .then(teams => {
                    teamId = teams[0].id
                    team2Id = teams[1].id
                    return Tournament.create({ nameTournament, teams: [teamId, team2Id], organizer: id })
                })
                .then(tournament => {
                    tournamentId = tournament.id
                })
        })
        it('should remove team from tournament correctly', () =>
            logic.removeTeamFromTournament(id, tournamentId, teamId)
                .then(res => {
                    expect(res).to.exist
                    return Tournament.findOne({ '_id': tournamentId })
                })
                .then(tournament => {
                    expect(tournament).to.exist
                    expect(tournament.teams.length).to.be.equal(1)
                    expect(tournament.teams[0]._id.toString()).to.be.equal(team2Id)
                })
        )
    })

    !true && describe('remove tournament', () => {
        const email2 = 'eduberenguer@gmail.com'
        const email3 = 'javirrim@gmail.com'
        const nameTournament = `F.C.${Math.random()}`
        let id, tournamentId
        beforeEach(() => {
            const users = [{ email, password, role: 'organizer' }, { email: email2, password }, { email: email3, password }]
            return User.create(users)
                .then(res => {
                    id = res[0].id
                    Tournament.create({ nameTournament, organizer: id })
                })
        })
        it('should remove the tournament correctly', () =>
            User.findOne({ '_id': id })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role).to.deep.equal(['organizer'])
                    return Tournament.findOne({ nameTournament })
                })
                .then(tournament => {
                    expect(tournament).to.exist
                    expect(tournament.nameTournament).to.be.equal(nameTournament)
                    tournamentId = tournament.id
                    return logic.removeTournament(id, tournamentId)
                })
                .then(res => {
                    expect(res).to.be.true
                })
        )
    })



    // OTHERS


    !true && describe('list all players', () => {
        const name = 'Sergio'
        const email2 = 'eduberenguer@gmail.com'
        const name2 = 'Edu'
        const email3 = 'javirrim@gmail.com'
        const name3 = 'Javi'
        beforeEach(() => User.create([{ email, password, role: 'player', name }, { email: email2, password, role: ['manager'], name: name2 }, { email: email3, password, role: 'player', name: name3 }]))
        it('should list all players correctly', () =>
            User.findOne({ email: email2 })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role).to.deep.equal(['manager'])
                    id = user.id
                    return logic.listAllPlayers(id)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.length).to.be.equal(2)
                })
        )

    })

    !true && describe('list all teams of an user', () => { // Se pueden hacer más tests de comprobación
        const email2 = 'jaume@gmail.com'
        const email3 = 'gerard@gmail.com'
        const name = 'F.C.Birralona'
        const name2 = 'Skylab Football Club'
        const name3 = 'Valencia C.F.'
        const description = 'Esto es un equipo de prueba'
        const owner = 'Sergio Castillo'
        beforeEach(() => {
            const users = [{ email, password, role: 'manager' }, { email: email2, password }, { email: email3, password }]
            return User.create(users)
                .then(res => Team.create([{ name, description, owner, manager: res[0]._id }, { name: name2, description, owner, manager: res[0]._id }, { name: name3, description, owner, manager: res[0]._id }]))
        })
        it('should list all teams correctly', () =>
            User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role).to.deep.equal(['manager'])
                    id = user.id
                    return logic.listMyTeams(id)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.length).to.be.equal(3)
                })

        )
    })

    !true && describe('retrieve team information', () => {
        const email2 = 'eduberenguer@gmail.com'
        const email3 = 'javirrim@gmail.com'
        const name = 'F.C.Birralona'
        const description = 'Esto es un equipo de prueba'
        const owner = 'Sergio Castillo'
        let id
        beforeEach(() => {
            const users = [{ email, password, role: 'manager' }, { email: email2, password }, { email: email3, password }]
            return User.create(users)
                .then(res => Team.create({ name, description, owner, manager: res[0]._id }))
        })
        it('should retrieve the team information correctly', () =>
            User.findOne({ email })
                .then(user => {
                    expect(user).to.exist
                    expect(user.role).to.deep.equal(['manager'])
                    id = user.id
                    return logic.retrieveTeam(id, name)
                })
                .then(team => {
                    expect(team).to.exist
                    expect(team.name).to.be.equal(name)
                    expect(team.description).to.be.equal(description)
                })

        )
    })

    !true && describe('add player to team', () => { // Falta comprobar cosas en el test
        const email2 = 'jaume@gmail.com'
        const email3 = 'gerard@gmail.com'
        const nameTeam = 'F.C.Birralona'
        const description = 'Esto es un equipo de prueba'
        const owner = 'Sergio Castillo'
        let id, playerId, playerId2, teamId, expectedId
        beforeEach(() => {
            const users = [{ email, password, role: ['manager', 'player'] }, { email: email2, password, role: 'player' }, { email: email3, password, role: 'player' }]
            return User.create(users)
                .then(res => {
                    id = res[0].id
                    playerId = res[1].id
                    playerId2 = res[2].id
                    return Team.create({ id, name: nameTeam, description, owner, manager: id })
                })
                .then(team => {
                    teamId = team.id
                })
        })

        it('should add one player to the team correctly', () =>
            logic.addPlayerToTeam(id, playerId, teamId)
                .then(res => {
                    expect(res).to.exist
                    expect(res).to.be.true
                    return Team.findOne({ '_id': teamId })
                })
                .then(team => {
                    expect(team).to.exist
                    expect(team.squad.length).to.be.equal(1)
                    expect(team.squad[0]._id.toString()).to.be.equal(playerId)
                })
        )
    })

    !true && describe('remove player from a team', () => { // Falta comprobar cosas en el test
        const email2 = 'jaume@gmail.com'
        const email3 = 'gerard@gmail.com'
        const nameTeam = 'F.C.Birralona'
        const description = 'Esto es un equipo de prueba'
        const owner = 'Sergio Castillo'
        let id, playerId, playerId2, teamId, expectedId
        beforeEach(() => {
            const users = [{ email, password, role: ['manager', 'player'] }, { email: email2, password, role: 'player' }, { email: email3, password, role: 'player' }]
            return User.create(users)
                .then(res => {
                    id = res[0].id
                    playerId = res[1].id
                    playerId2 = res[2].id
                    return Team.create({ id, name: nameTeam, description, owner, manager: id })
                })
                .then(team => {
                    teamId = team.id
                })
        })

        it('should add one player to the team correctly', () =>
            logic.addPlayerToTeam(id, playerId, teamId)
                .then(res => {
                    expect(res).to.exist
                    expect(res).to.be.true
                    return Team.findOne({ '_id': teamId })
                })
                .then(team => {
                    expect(team).to.exist
                    expect(team.squad.length).to.be.equal(1)
                    expect(team.squad[0]._id.toString()).to.be.equal(playerId)
                })
        )
    })

    !true && describe('list all tournaments', () => {
        const nameTournament = 'Skylab Tournament'
        const nameTournament2 = 'Liga BBVA'
        const nameTournament3 = 'Premier League'
        const email2 = 'jaume@gmail.com'
        const email3 = 'gerard@gmail.com'
        beforeEach(() => {
            const users = [{ email, password }, { email: email2, password }, { email: email3, password }]
            return User.create(users)
                .then(res => Tournament.create([{ email, password, nameTournament, organizer: res[0]._id }, { email: email2, password, nameTournament: nameTournament2, organizer: res[1]._id }]))
        })
        it('should list all tournaments correctly', () =>
            logic.listAllTournaments()
                .then(tournaments => {
                    expect(tournaments).to.exist
                    expect(tournaments.length).to.equal(2) // Estoy listando todos los campos con lo cual hay que hacer un map
                })
        )
    })



    after(() =>
        Promise.all([
            User.deleteMany(),
            Team.deleteMany(),
            Tournament.deleteMany(),
            Match.deleteMany(),
            Result.deleteMany()
        ])
            .then(() => _connection.disconnect())
    )

})