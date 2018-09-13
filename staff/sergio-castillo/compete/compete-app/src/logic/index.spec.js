require('dotenv').config()
require('isomorphic-fetch')
const { expect } = require('chai')
const logic = require('.')
const jwt = require('jsonwebtoken')

describe('logic', () => {

    const { JWT_SECRET } = process.env
    let email, password
    const dni = `${Math.floor(Math.random() * 100000000)}N`
    const name = `Sergio${Math.random()}`
    const surname = `Castillo${Math.random()}`
    const age = 37
    const gender = 'male'
    const height = 172
    const weight = 68
    const position = 'Defender'
    const squadNumber = 4
    const photo = 'http://www.google.es'
    let id, token


    beforeEach(() => {

        email = `user${Math.random()}@gmail.com`, password = '123456'
    })

    // TODO All the validates must be tested

    // USER TESTS

    !true && describe('register user', () => {
        it('should register correctly on new user', () =>
            logic.register(email, password)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on register with an existing user', () =>
            logic.register(email, password)
                .then(() => logic.register(email, password))
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`The user with email ${email} already exists on database`)
                })
        )

        it('should fail on trying to register with an undefined email', () =>
            logic.register(undefined, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid email')
                })
        )

        it('should fail on trying to register with a numeric email', () =>
            logic.register(123, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid email')
                })
        )

        it('should fail on trying to register with an empty email', () =>
            logic.register('', password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid email')
                })
        )

        it('should fail on trying to register with an undefined password', () => {
            logic.register(email, undefined)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid password')
                })
        })

        it('should fail on trying to register with an empty password', () => {
            logic.register(email, '')
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid password')
                })
        })

        it('should fail on trying to register with a numeric password', () =>
            logic.register(email, 123456)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid password')
                })
        )

        it('should fail on trying to register with a very short password', () =>
            logic.register(email, '123')
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This password is too short. Please introduce 6 characters at least')
                })
        )
    })

    !true && describe('authenticate user', () => {
        it('should authenticate correctly on new user', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    expect(res).to.exist
                    expect(res.token).to.be.a('string')
                    expect(res.id).to.be.a('string')

                    let payload

                    expect(() => payload = jwt.verify(res.token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(res.id)
                })
        )

        it('should fail on unregistered user', () =>
            logic.authenticate(email, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`The user with email ${email} does not exist on database`)
                })
        )

        it('should fail on undefined email', () =>
            logic.authenticate(undefined, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid email`)
                })
        )

        it('should fail on empty email', () =>
            logic.authenticate('', password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid email`)
                })
        )

        it('should fail on a numeric email', () =>
            logic.authenticate(123, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid email`)
                })
        )

        it('should fail on undefined password', () =>
            logic.authenticate(email, undefined)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid password`)
                })
        )

        it('should fail on empty password', () =>
            logic.authenticate(email, '')
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid password`)
                })
        )

        it('should fail on a numeric password', () =>
            logic.authenticate(email, 123456)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid password`)
                })
        )
    })

    !true && describe('update profile', () => {
        let id, token, newPassword = '654321'
        it('should update the profile correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    expect(res).to.exist
                    expect(res.token).to.be.a('string')
                    expect(res.id).to.be.a('string')

                    let payload
                    id = res.id
                    token = res.token

                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.updateProfile(id, token, password, newPassword)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('user updated')
                })
        )

        it('should fail on update user with undefined id', () =>
            logic.updateProfile(undefined, token, password, newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid id`)
                })
        )
        it('should fail on update user with empty id', () =>
            logic.updateProfile('', token, password, newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid id`)
                })
        )
        it('should fail on update user with numeric id', () =>
            logic.updateProfile(123456789, token, password, newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid id`)
                })
        )

        it('should fail on update user with undefined token', () =>
            logic.updateProfile(id, undefined, password, newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid token`)
                })
        )

        it('should fail on update user with empty token', () =>
            logic.updateProfile(id, '', password, newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid token`)
                })
        )

        it('should fail on update user with numeric token', () =>
            logic.updateProfile(id, 242323543, password, newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`jwt malformed`)
                })
        )

        it('should fail on update user with undefined password', () =>
            logic.updateProfile(id, token, undefined, newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid password`)
                })
        )
        it('should fail on update user with empty password', () =>
            logic.updateProfile(id, token, '', newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid password`)
                })
        )
        it('should fail on update user with numeric password', () =>
            logic.updateProfile(id, token, 123456, newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid password`)
                })
        )

        it('should fail on update user with wrong password', () =>
            logic.updateProfile(id, token, '32425252', newPassword)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`The password 32425252 is wrong`)
                })
        )

        it('should fail on update user with undefined new password', () =>
            logic.updateProfile(id, token, password, undefined)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid new password`)
                })
        )
        it('should fail on update user with empty new password', () =>
            logic.updateProfile(id, token, password, '')
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid new password`)
                })
        )
        it('should fail on update user with numeric new password', () =>
            logic.updateProfile(id, token, password, 123456)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`This is an invalid new password`)
                })
        )

        it('should fail on update user with new password equal to password', () =>
            logic.updateProfile(id, token, password, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal(`The password ${password} is wrong`)
                })
        )

    })

    !true && describe('unregister user', () => {
        it('should unregister the user correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    id = res.id
                    token = res.token
                    expect(res).to.exist
                    expect(token).to.be.a('string')
                    expect(id).to.be.a('string')

                    let payload

                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.unregisterUser(id, token, password)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('user unregistered')
                })
        )

        it('should fail on unregistered user with an undefined id', () =>
            logic.unregisterUser(undefined, token, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid id')
                })
        )

        it('should fail on unregistered user with an empty id', () =>
            logic.unregisterUser('', token, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid id')
                })
        )

        it('should fail on unregistered user with a numeric id', () =>
            logic.unregisterUser(32423235, token, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid id')
                })
        )

        it('should fail on unregistered user with an undefined token', () =>
            logic.unregisterUser(id, undefined, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid token')
                })
        )

        it('should fail on unregistered user with an empty token', () =>
            logic.unregisterUser(id, '', password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid token')
                })
        )

        it('should fail on unregistered user with a numeric token', () =>
            logic.unregisterUser(id, 1231241, password)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('jwt malformed')
                })
        )

        it('should fail on unregistered user with an undefined password', () =>
            logic.unregisterUser(id, token, undefined)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid password')
                })
        )

        it('should fail on unregistered user with an empty password', () =>
            logic.unregisterUser(id, token, '')
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid password')
                })
        )

        it('should fail on unregistered user with a numeric password', () =>
            logic.unregisterUser(id, token, 4353221)
                .catch(err => err)
                .then(err => {
                    expect(err).to.exist
                    expect(err.message).to.equal('This is an invalid password')
                })
        )

        // it('should fail on unregistered user with a wrong password', () =>
        //     logic.unregisterUser(id, token, '123457')
        //         .catch(err => err)
        //         .then(err => {
        //             expect(err).to.exist
        //             expect(err.message).to.equal('This is an invalid password')
        //         })
        // )

    })

    // PLAYER TESTS

    !true && describe('add player role to user', () => { // FALTAN TESTS DE FAIL
        it('should change the user role to player correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    id = res.id
                    token = res.token
                    expect(res).to.exist
                    expect(token).to.be.a('string')
                    expect(id).to.be.a('string')

                    let payload

                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.addPlayerRole(id, token, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Role player added correctly')
                })
        )
        it('should fail on trying to add an user as a player with an undefined id', () =>
            logic.addPlayerRole(undefined, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to add an user as a player with an empty id', () =>
            logic.addPlayerRole('', dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )

        it('should fail on trying to add an user as a player with a numeric id', () =>
            logic.addPlayerRole(2347594032, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('This is an invalid id'))
        )


    })

    !true && describe('retrieve user roles', () => {
        it('should retrieve the user roles correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    id = res.id
                    token = res.token
                    expect(res).to.exist
                    expect(res.token).to.be.a('string')
                    expect(res.id).to.be.a('string')

                    let payload
                    expect(() => payload = jwt.verify(res.token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.addPlayerRole(id, token, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Role player added correctly')
                    return logic.retrieveUserRoles(id, token)
                })
                .then(res => {
                    debugger
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Retrieve roles correctly')
                    expect(res.roles).to.exist
                    expect(res.roles[0]).to.be.equal('player')
                })
        )
    })

    !true && describe('retrieve player information', () => {
        let id, token
        it('should retrieve the player information correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    id = res.id
                    token = res.token
                    expect(res).to.exist
                    expect(token).to.be.a('string')
                    expect(id).to.be.a('string')
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.addPlayerRole(id, token, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Role player added correctly')
                    return logic.retrievePlayer(id, token)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Retrieve user correctly')
                    expect(res.user.email).to.be.equal(email)
                    expect(res.user.email).to.equal(email)
                    expect(res.user.dni).to.equal(dni)
                    expect(res.user.name).to.equal(name)
                    expect(res.user.surname).to.equal(surname)
                    expect(res.user.age).to.equal(age)
                    expect(res.user.gender).to.equal(gender)
                    expect(res.user.height).to.equal(height)
                    expect(res.user.weight).to.equal(weight)
                    expect(res.user.position).to.equal(position)
                    expect(res.user.squadNumber).to.equal(squadNumber)
                    expect(res.user.photo).to.equal(photo)
                })
        )
    })

    true && describe('list my teams as player', () => { // TODO

    })

    true && describe('list my tournaments as player', () => { // TODO

    })

    !true && describe('remove player role', () => {
        let id, token
        it('should remove the player role correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    id = res.id
                    token = res.token
                    expect(res).to.exist
                    expect(token).to.be.a('string')
                    expect(id).to.be.a('string')
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.addPlayerRole(id, token, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Role player added correctly')
                    return logic.removePlayerRole(id, token)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Player role removed')
                })
        )
    })

    // TEAM TESTS

    !true && describe('create team', () => {
        const name = 'F.C.Birralona'
        const description = 'Equipo de prueba'
        const owner = 'Gerard Baste'
        it('should create the team correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    id = res.id
                    token = res.token
                    expect(res).to.exist
                    expect(token).to.be.a('string')
                    expect(id).to.be.a('string')
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.createTeam(id, token, name, description, owner)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Team created')
                })
        )
    })

    !true && describe('list all my teams as manager', () => {
        const name = `Team${Math.random()}`
        const name2 = `Team${Math.random()}`
        const description = 'Equipo de prueba'
        const owner = 'Gerard Baste'
        it('should list all my teams as a manager correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    id = res.id
                    token = res.token
                    expect(res).to.exist
                    expect(token).to.be.a('string')
                    expect(id).to.be.a('string')
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.createTeam(id, token, name, description, owner)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Team created')
                    return logic.createTeam(id, token, name2, description, owner)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Team created')
                    return logic.listAllMyTeamsAsManager(id, token)
                })
                .then(teams => {
                    expect(teams).to.exist
                    expect(teams.length).to.be.equal(2)
                    expect(teams[0].name).to.be.equal(name)
                    expect(teams[0].description).to.be.equal(description)
                    expect(teams[1].name).to.be.equal(name2)
                    expect(teams[1].description).to.be.equal(description)
                })
        )
    })

    true && describe('retrieve team data', ()=> {
        // TODO
    })

    true && describe('list players from team', () => {
        // TODO
    })

    true && describe('search players by query', () => { // TODO

    })

    true && describe('add player to team', () => { // TODO

    })

    true && describe('remove player from team', () => { // TODO

    })

    !true && describe('remove a team', () => {
        let teamid
        const name = `Team${Math.random()}`
        const name2 = `Team${Math.random()}`
        const description = 'Equipo de prueba'
        const owner = 'Gerard Baste'
        it('should remove the team correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    id = res.id
                    token = res.token
                    expect(res).to.exist
                    expect(token).to.be.a('string')
                    expect(id).to.be.a('string')
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.createTeam(id, token, name, description, owner)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Team created')
                    return logic.createTeam(id, token, name2, description, owner)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Team created')
                    return logic.listMyTeamsAsManager(id, token)
                })
                .then(teams => {
                    expect(teams).to.exist
                    expect(teams.length).to.be.equal(2)
                    expect(teams[0].name).to.be.equal(name)
                    expect(teams[0].description).to.be.equal(description)
                    expect(teams[1].name).to.be.equal(name2)
                    expect(teams[1].description).to.be.equal(description)
                    teamid = teams[0]._id
                    return logic.removeTeam(id, token, teamid)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Team removed correctly')
                })
        )
    })

    // TOURNAMENT

    !true && describe('create tournament', () => {
        let id, token
        const nameTournament = 'Second Liga BBVA'
        it('should create the tournament correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    expect(res).to.exist
                    expect(res.token).to.be.a('string')
                    expect(res.id).to.be.a('string')
                    id = res.id
                    token = res.token
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.createTournament(id, token, nameTournament)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Tournament created')
                })
        )
    })

    !true && describe('list all my tournaments as organizer', () => {
        let id, token
        const nameTournament = `Liga${Math.random()}`
        const nameTournament2 = `Liga${Math.random()}`
        it('should list all the tournaments correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    expect(res).to.exist
                    expect(res.token).to.be.a('string')
                    expect(res.id).to.be.a('string')
                    id = res.id
                    token = res.token
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.createTournament(id, token, nameTournament)
                })
                .then(() => logic.createTournament(id, token, nameTournament2))
                .then(() => logic.listMyTournamentsAsOrganizer(id, token))
                .then(tournaments => {
                    expect(tournaments).to.exist
                    expect(tournaments.length).to.be.equal(2)
                })
        )
    })

    !true && describe('list all the teams as organizer', () => {
        let id, token
        const nameTournament = `Liga${Math.random()}`
        const nameTournament2 = `Liga${Math.random()}`
        it('should list all the tournaments correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    expect(res).to.exist
                    expect(res.token).to.be.a('string')
                    expect(res.id).to.be.a('string')
                    id = res.id
                    token = res.token
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.createTournament(id, token, nameTournament)
                })
                .then(() => logic.createTournament(id, token, nameTournament2))
                .then(() => logic.listMyTournamentsAsOrganizer(id, token))
                .then(tournaments => {
                    expect(tournaments).to.exist
                    expect(tournaments.length).to.be.equal(2)
                })
        )
    })

    !true && describe('retrieve tournament data', ()=> {
        // TODO
    })

    true && describe('list teams from tournament',()=> {
        // TODO
    })

    !true && describe('add team to tournament', () => {
        let id, tournamentId, teamId
        const nameTournament = `Liga${Math.random()}`
        const name = `FC${Math.random()}`
        const description = 'Equipo de Fútbol Sala'
        const owner = 'Sergio Castillo'
        beforeEach(() => {
            return logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    expect(res).to.exist
                    expect(res.token).to.be.a('string')
                    expect(res.id).to.be.a('string')
                    id = res.id
                    token = res.token
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.createTeam(id, token, name, description, owner)
                })
                .then(() => logic.listAllMyTeamsAsManager(id, token))
                .then(res => {
                    teamId = res[0].id
                    return logic.createTournament(id, token, nameTournament)
                })
                .then(() => logic.listMyTournamentsAsOrganizer(id, token)
                )
                .then(res => {
                    tournamentId = res[0].id
                })
        })
        it('should add the team to tournament correctly', () =>
            logic.addTeamToTournament(id, token, tournamentId, teamId)
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Add team correctly')
                    return logic.listMyTournamentsAsOrganizer(id, token)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res[0].teams[0]).to.be.equal(teamId)
                })
        )
    })

    !true && describe('remove team from tournament', () => { // TODO
        let id, tournamentId, teamId
        const nameTournament = `Liga${Math.random()}`
        const name = `FC${Math.random()}`
        const description = 'Equipo de Fútbol Sala'
        const owner = 'Sergio Castillo'
        beforeEach(() => {
            return logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    expect(res).to.exist
                    expect(res.token).to.be.a('string')
                    expect(res.id).to.be.a('string')
                    id = res.id
                    token = res.token
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.createTeam(id, token, name, description, owner)
                })
                .then(() => logic.listAllMyTeamsAsManager(id, token))
                .then(res => {
                    teamId = res[0].id
                    return logic.createTournament(id, token, nameTournament)
                })
                .then(() => logic.listMyTournamentsAsOrganizer(id, token)
                )
                .then(res => {
                    tournamentId = res[0].id
                    return logic.addTeamToTournament(id, token, tournamentId, teamId)
                })
                .then(res => {
                    expect(res).to.exist
                })
        })
        it('should add the team to tournament correctly', () =>
            logic.removeTeamFromTournament(id, token, tournamentId, teamId)
                .then(res => {
                    expect(res).to.exist
                    expect(res.message).to.be.equal('Remove team correctly')
                    return logic.listMyTournamentsAsOrganizer(id, token)
                })
                .then(res => {
                    expect(res).to.exist
                    expect(res[0].teams.length).to.be.equal(0)
                })
        )
    })

    !true && describe('remove tournament', () => {
        let id, token, tournamentId
        const nameTournament = `Liga${Math.random()}`
        it('should remove the tournament correctly', () =>
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => {
                    expect(res).to.exist
                    expect(res.token).to.be.a('string')
                    expect(res.id).to.be.a('string')
                    id = res.id
                    token = res.token
                    let payload
                    expect(() => payload = jwt.verify(token, JWT_SECRET)).not.to.throw()
                    expect(payload.sub).to.equal(id)
                    return logic.createTournament(id, token, nameTournament)
                })
                .then(() => logic.listMyTournamentsAsOrganizer(id, token))
                .then(tournaments => {
                    expect(tournaments).to.exist
                    expect(tournaments.length).to.be.equal(1)
                    tournamentId = tournaments[0].id
                    return logic.removeTournament(id, token, tournamentId)
                })
                .then(res => {
                    expect(res).to.exist
                })
        )

    })

})