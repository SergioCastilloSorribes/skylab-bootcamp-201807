'use strict'

const validateEmail = require('../utils/validate-email')
const { User, Team, Tournament, Match, Result } = require('../data/models')
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: 'sergiocastillo',
    api_key: '649713476529676',
    api_secret: 'K5COwbhJ3S2POj887pf77oVfpgo'
})

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
}

const logic = {

    _validateEmail(email) {
        if (!validateEmail(email)) throw new LogicError('This is an invalid email')
    },
    _validateStringField(name, value) {
        if (typeof value !== 'string' || !value.length) throw new LogicError(`This is an invalid ${name}`)
    },
    _validateNumberField(name, value) {
        if (isNaN(value) || typeof value === 'string') throw new LogicError(`This is an invalid ${name}`)
    },
    _validateDateField(name, field) {
        if (!(field instanceof Date)) throw new LogicError(`This is an invalid ${name}`)
    },
    _validateIdField(id) {
        if (!id) throw new LogicError('This is an invalid id')
        if (!isNaN(id)) throw new LogicError('This is an invalid id')
    },
    _saveImage(base64Image) {
        return Promise.resolve().then(() => {
            if (typeof base64Image !== 'string') throw new LogicError('base64Image is not a string')

            return new Promise((resolve, reject) => {
                return cloudinary.v2.uploader.upload(base64Image, function (err, data) {
                    if (err) return reject(err)

                    resolve(data.url)
                })
            })
        })
    },
    _random(winners) {
        const id1 = winners.random()
        let id2

        while ((id2 = winners.random()) === id1);

        return [id1, id2]
    },

    /**
     * USER / Register a new user in the database.
     * 
     * @param {email} emaill 
     * @param {string} password 
     * 
     * @returns {Promise<boolean>}
     */

    register(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField('password', password)

                return User.findOne({ email })
            })
            .then(user => {
                if (user) throw new LogicError(`The user with email ${email} already exists on database`)

                return User.create({ email, password })
            })
            .then(res => true)
    },

    /**
     * 
     * USER: Retrieve a userId of a user.
     * 
     * @param {email} email 
     * @param {string} password 
     * 
     * @returns {Promise<string>}
     */

    authenticate(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField('password', password)
                return User.findOne({ email })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with email ${email} does not exist on database`)
                if (user.password !== password) throw new LogicError(`The password is wrong`)
                return user._id
            })
    },

    /**
     * 
     * USER: Update the password
     * 
     * @param {string} id
     * @param {string} password
     * @param {string} newPassword
     * 
     * @returns {true}
     */

    updatePassword(id, password, newPassword) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateStringField('password', password)
                this._validateStringField('new password', newPassword)

                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (user.password !== password) throw new LogicError(`The password ${password} is wrong`)
                if (password === newPassword) throw new LogicError('The new password must be different that the old password')

                return User.findByIdAndUpdate({ "_id": id }, { "password": newPassword })
            })
            .then(() => true)
    },

    /**
    * 
    * USER: Remove the user from the database
    * 
    * @param {string} id
    * @param {string} password
    * 
    * @returns {true}
    */

    unregister(id, password) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateStringField('password', password)

                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)

                if (user.password !== password) throw new LogicError(`The password ${password} is wrong`)

                return User.deleteOne({ '_id': id })
            })
            .then(() => true)
    },

    /**
      * 
      * PLAYER: Retrieve the roles of the user : player, manager and/or organizer
      * 
      * @param {string} id
      * 
      * @returns {true}
      */

    retrieveUserRoles(id) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} not exists on database`)
                return user.role || []
            })
    },

    /**
     * 
     * PLAYER: Add the user as a player
     * 
     * @param {string} id
     * @param {string} dni
     * @param {string} name
     * @param {string} surname
     * @param {number} age
     * @param {string} gender
     * @param {number} height
     * @param {number} weight
     * @param {string} position
     * @param {number} squadNumber
     * @param {cloudinary} photo
     * 
     * @returns {Promise<boolean>}
     */

    iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, squadNumber, photo) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateStringField('dni', dni)
                if (dni.length < 9) throw new LogicError(`The dni ${dni} is not a correct dni`)
                this._validateStringField('name', name)
                this._validateStringField('surname', surname)
                this._validateNumberField('age', age)
                if ((age < 14) || (age > 70)) throw new LogicError('This is an inadequate age')
                this._validateStringField('gender', gender)
                if ((gender !== 'male') && (gender !== 'female') && (gender !== 'other')) throw new LogicError('This is an invalid gender')
                this._validateNumberField('height', height)
                if ((height < 130) || (height > 250)) throw new LogicError('This is an inadequate height')
                this._validateNumberField('weight', weight)
                if ((weight < 45) || (weight > 130)) throw new LogicError('This is an inadequate weight')
                this._validateStringField('position', position)
                this._validateNumberField('squad number', squadNumber)
                if ((squadNumber < 1) || (squadNumber > 99)) throw new LogicError('This is an inadequate squad number')
                this._validateStringField('photo', photo)
                return User.findOne({ dni })
            })
            .then(user => {
                if (user) throw new LogicError(`The dni ${dni} already exists in database`)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (user.role[0] === 'player' || user.role[1] === 'player' || user.role[2] === 'player') throw new LogicError(`The user with id ${id} is already a player`)
                user.dni = dni
                user.name = name
                user.surname = surname
                user.age = age
                user.gender = gender
                user.height = height
                user.weight = weight
                user.position = position
                user.squadNumber = squadNumber
                user.photo = photo
                user.role.push('player')

                return user.save()
            })
            .then(() => true)

    },

    /**
     * 
     * PLAYER: Retrieve the player information
     * 
     * @param {string} id
     * @param {string} playerId
     * 
     * @returns {Promise<Array>}
     */

    retrievePlayer(id, playerId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                if (playerId) this._validateIdField(playerId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} not exists on database`)
                if (user.role.length === 0) throw new LogicError(`The user with id ${id} has not any permission to receive data information`)
                if (playerId) {
                    return User.findOne({ '_id': playerId }, { _id: 0, email: 1, dni: 1, name: 1, surname: 1, age: 1, gender: 1, height: 1, weight: 1, position: 1, squadNumber: 1, photo: 1 })
                } else {
                    return User.findOne({ '_id': id }, { _id: 0, email: 1, dni: 1, name: 1, surname: 1, age: 1, gender: 1, height: 1, weight: 1, position: 1, squadNumber: 1, photo: 1, role: 1 })
                }
            })
            .then(user => {
                if (!user) throw new LogicError(`The player with id ${id} not exists on database`)
                if ((user.role[0] !== 'player') && (user.role[1] !== 'player') && (user.role[2] !== 'player')) throw new LogicError(`The user with id ${id} is not a player`)
                delete user.role
                user.save()
                return user
            })

    },

    /**
    * 
    * PLAYER: Retrieve all the teams which the player is in the squad
    * 
    * @param {string} id
    * 
    * @returns {Promise<Array>}
    */

    listMyTeamsAsPlayer(id) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (!user.role.includes('player')) throw new LogicError(`The user with id ${id} has not any team created`)
                const filter = {}
                filter.squad = []
                filter.squad.push(id)
                return Team.find(filter, { __v: 0 })
            })
            .then(teams => {
                if (!teams) throw new LogicError('There is not any team in database')
                teams.forEach(team => {
                    team.id = team._id.toString()
                    delete team._id
                })
                return teams
            })
    },

    /**
    * 
    * PLAYER: Retrieve all the tournaments of the teams of the player
    * 
    * @param {string} id
    * @param {string} teamId
    * 
    * @returns {Promise<Array>}
    */

    listMyTournamentsAsPlayer(id, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (!user.role.includes('player')) throw new LogicError(`The user with id ${id} has not a player`)
                return Team.findOne({ '_id': teamId })
            })
            .then(team => {
                if (!team) throw new LogicError(`The team with id ${teamId} does not exists on database`)
                const filter = {}
                filter.teams = []
                filter.teams.push(teamId)
                return Tournament.find(filter, { __v: 0 })
            })
            .then(tournaments => {
                if (!tournaments) throw new LogicError(`The team with id ${teamId} do not participate in any tournament`)
                tournaments.forEach(tournament => {
                    tournament.id = tournament._id.toString()
                    delete tournament._id
                })
                return tournaments
            })
    },

    /**
    * 
    * PLAYER: Remove the user as a player 
    * 
    * @param {string} id
    * 
    * @returns {Promise<Array>}
    */

    iDontWantToBeAPlayer(id) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (user.role[0] === 'player' || user.role[1] === 'player' || user.role[2] === 'player') {
                    for (let i = 0; i < 3; i++) {
                        if (user.role[i] === 'player') {
                            user.role.splice(i, 1)
                        }
                    }
                } else throw new LogicError(`The user with id ${id} is not a player`)
                delete user.dni
                delete user.name
                delete user.surname
                delete user.age
                delete user.gender
                delete user.height
                delete user.weight
                delete user.position
                delete user.squadNumber
                delete user.photo
                return user.save()
            })
            .then(() => {
                return true
            })
    },

    // TEAM METHODS

    createTeam(id, name, description, owner) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateStringField('name', name)
                this._validateStringField('description', description)
                this._validateStringField('owner', owner)
                return Team.findOne({ name })
            })
            .then(team => {
                if (team) throw new LogicError(`The team name ${name} already exists on database`)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (user.role[0] !== 'manager' && user.role[1] !== 'manager' && user.role[3] !== 'manager') {
                    user.role.push('manager')
                    user.save()
                }
                const team = { name, description, owner, manager: id }
                return Team.create(team)
            })
            .then(() => {
                return true
            })
    },

    listMyTeamsAsManager(id) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (!user.role.includes('manager')) throw new LogicError(`The user with id ${id} has not any team created`)
                const filter = {}
                filter.manager = id
                return Team.find(filter, { __v: 0 })
            })
            .then(teams => {
                if (!teams) throw new LogicError(`The user with id ${id} is not the manager of any team`)
                teams.forEach(team => {
                    team.id = team._id.toString()
                    delete team._id
                })
                return teams
            })
    },

    retrieveTeamData(id, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (!user.role) throw new LogicError(`The user with id ${id} has not any role`)
                return Team.findOne({ '_id': teamId })
            })
            .then(team => {
                if (!team) throw new LogicError(`The team with id ${teamId} does not exist on database`)
                team.id = team._id.toString()
                delete team._id
                return team
            })
    },

    listPlayersFromTeam(id, teamId) {
        let players = []
        let squad = []
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user.role) throw new LogicError(`The user with id ${id} has not any permission`)
                return Team.findOne({ '_id': teamId })
            })
            .then(team => {
                for (let i = 0; i < team.squad.length; i++) {
                    players.push(team.squad[i].toString())
                }
                return User.find()
            })
            .then(users => {
                for (let i = 0; i < users.length; i++) {
                    if (players.includes(users[i].id)) squad.push(users[i])
                }
                return squad
            })
    },

    searchPlayersByQuery(id, name, surname, dni) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user.role.includes('manager')) throw new LogicError(`The user with id ${id} has not any team created`)
                const filter = {}
                filter.role = 'player'
                if (name) filter.name = name
                if (surname) filter.surname = surname
                if (dni) filter.dni = dni
                return User.find(filter, { __v: 0 })
            })
    },

    addPlayerToTeam(id, teamId, playerId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(playerId)
                this._validateIdField(teamId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user.role.includes('manager')) throw new LogicError(`The user with id ${id} has not any team created`)
                return User.findOne({ '_id': playerId })
            })
            .then(user => {
                if (!user.role.includes('player')) throw new LogicError(`The user with id ${playerId} is not a player`)
                return Team.findOne({ '_id': teamId })
            })
            .then(team => {
                if (!team) throw new LogicError(`The team with id ${teamId} does not exist on database`)
                let count = 0
                if (team.squad) {
                    for (let i = 0; i < team.squad.length; i++) {
                        if (team.squad[i].toString() === playerId) count++
                    }
                }
                if (count === 1) throw new LogicError(`The player with id ${playerId} already exists in this team`)
                // if(team.squad.includes(playerId)) throw new LogicError(`The player with id ${playerId} already exists in this team`)
                team.squad.push(playerId)
                return team.save()
            })
            .then(res => true)
    },

    removePlayerFromATeam(id, teamId, playerId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(playerId)
                this._validateIdField(teamId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user.role.includes('manager')) throw new LogicError(`The user with id ${id} has not any team created`)
                return User.findOne({ '_id': playerId })
            })
            .then(user => {
                if (!user.role.includes('player')) throw new LogicError(`The user with id ${playerId} is not a player`)
                return Team.findOne({ '_id': teamId })
            })
            .then(team => {
                let count = 0
                if (team.squad) {
                    for (let i = 0; i < team.squad.length; i++) {
                        if (team.squad[i].toString() === playerId) {
                            team.squad.splice(i, 1)
                            count++
                        }
                    }
                }
                if (count === 0) throw new LogicError(`The player with id ${playerId} not exists in this team`)
                return team.save()
            })
            .then(res => true)
    },

    removeTeam(id, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} not exists on database`)
                if (!user.role.includes('manager')) throw new LogicError(`The user with id ${id} has not any team created`)
                return Team.findOne({ '_id': teamId })
            })
            .then(team => {
                if (!team) throw new LogicError(`The team with id ${teamId} does not exist on database`)
                if (team.manager.toString() !== id) throw new LogicError(`The team with id ${teamId} does not belong to this user`)
                return Team.deleteOne({ '_id': teamId })
            })
            .then(() => true)
    },

    // TOURNAMENT METHODS

    createTournament(id, nameTournament) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateStringField('nameTournament', nameTournament)
                return Tournament.findOne({ nameTournament })
            })
            .then(tournament => {
                if (tournament) throw new LogicError(`The tournament name ${name} exists on database`)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (user.role[0] !== 'organizer' && user.role[1] !== 'organizer' && user.role[3] !== 'organizer') {
                    user.role.push('organizer')
                    user.save()
                }
                const tournament = { nameTournament, organizer: id, state: 'creating' }
                return Tournament.create(tournament)
            })
            .then(() => {
                return true
            })
    },

    listMyTournamentsAsOrganizer(id) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} not exists on database`)
                if ((user.role[0] !== 'organizer') && (user.role[1] !== 'organizer') && (user.role[2] !== 'organizer')) throw new LogicError(`The user with id ${id} has not any tournament created`)
                return Tournament.find()
            })
            .then(tournaments => {
                if (!tournaments) throw new LogicError('There is not any tournament in database')
                let list = []
                tournaments.forEach(tournament => {
                    let organizerId = tournament.organizer._id.toString()
                    if (organizerId === id) list.push({ name: tournament.nameTournament, id: tournament.id, teams: tournament.teams, state: tournament.state, matches: tournament.matches })
                })
                return list || []
            })
    },

    listAllTeamsAsOrganizer(id) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} not exists on database`)
                if ((user.role[0] !== 'organizer') && (user.role[1] !== 'organizer') && (user.role[2] !== 'organizer')) throw new LogicError(`The user with id ${id} has not any tournament created`)
                return Team.find()
            })
            .then(teams => {
                if (!teams) throw new LogicError('There is not any team in database')
                let list = []
                teams.forEach(team => {
                    list.push({ name: team.name, id: team.id, description: team.description, squad: team.squad })
                })
                return list || []
            })
    },

    retrieveTournamentData(id, tournamentId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exists on database`)
                if (!user.role) throw new LogicError(`The user with id ${id} has not any role`)
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                if (!tournament) throw new LogicError(`The team with id ${teamId} does not exist on database`)
                tournament.id = tournament._id.toString()
                delete tournament._id
                return tournament
            })
    },

    listTeamsFromTournament(id, tournamentId) {
        let teamsIds = []
        let tournamentTeams = []
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user.role) throw new LogicError(`The user with id ${id} has not any permission`)
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                for (let i = 0; i < tournament.teams.length; i++) {
                    teamsIds.push(tournament.teams[i].toString())
                }
                return Team.find()
            })
            .then(teams => {
                for (let i = 0; i < teams.length; i++) {
                    if (teamsIds.includes(teams[i].id)) tournamentTeams.push(teams[i])
                }
                return tournamentTeams
            })
    },

    addTeamToTournament(id, tournamentId, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                this._validateIdField(teamId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if ((user.role[0] !== 'organizer') && (user.role[1] !== 'organizer') && (user.role[2] !== 'organizer')) throw new LogicError(`The user with id ${id} has not any tournament created`)
                return Team.findOne({ '_id': teamId })
            })
            .then(team => {
                if (!team) throw new LogicError(`The team with id ${tournamentId} not exists on database`)
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                if (id !== tournament.organizer.toString()) throw new LogicError(`The user with the id ${id} has not permission in this tournament`)
                if (tournament.teams.length === 32) throw new LogicError(`This tournament ${tournament.name} is full of teams`)
                tournament.teams.push(teamId)
                return tournament.save()
            })

    },

    removeTeamFromTournament(id, tournamentId, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)
                this._validateIdField(tournamentId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if ((user.role[0] !== 'organizer') && (user.role[1] !== 'organizer') && (user.role[2] !== 'organizer')) throw new LogicError(`The user with id ${id} has not any tournament created`)
                return Team.findOne({ '_id': teamId })
            })
            .then(team => {
                if (!team) throw new LogicError(`The team with id ${tournamentId} not exists on database`)
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                if (id !== tournament.organizer.toString()) throw new LogicError(`The user with the id ${id} has not permission in this tournament`)

                for (let i = 0; i < tournament.teams.length; i++) {
                    if (tournament.teams[i].toString() === teamId) {
                        tournament.teams.splice(i, 1)
                    }
                }
                return tournament.save()
            })

    },

    removeTournament(id, tournamentId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} not exists on database`)
                if ((user.role[0] !== 'organizer') && (user.role[1] !== 'organizer') && (user.role[2] !== 'organizer')) throw new LogicError(`The user with id ${id} has not any tournament created`)
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                if (!tournament) throw new LogicError(`The tournament with id ${tournamentId} does not exist on database`)
                if (tournament.organizer.toString() !== id) throw new LogicError(`The tournament with id ${tournamentId} does not belong to this user`)

                return Tournament.deleteOne({ '_id': tournamentId })
            })
            .then(() => true)
    },

    createNewMatch(id, tournamentId, firstTeamId, secondTeamId) {
        let matchId
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                // this._validateIdField(firstTeamId)
                // this._validateIdField(secondTeamId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if ((user.role[0] !== 'organizer') && (user.role[1] !== 'organizer') && (user.role[2] !== 'organizer')) throw new LogicError(`The user with id ${id} has not any tournament created`)
                return Team.findOne({ '_id': firstTeamId })
            })
            .then(team => {
                if (!team) throw new LogicError(`The team with id ${firstTeamId} does not exists on database (1)`)
                return Team.findOne({ '_id': secondTeamId })
            })
            .then(team => {
                if (!team) throw new LogicError(`The team with id ${secondTeamId} does not exists on database (2)`)
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                if (!tournament) throw new LogicError(`The tournament with id ${tournamentId} does not exists on database`)
                if (tournament.organizer.toString() !== id) throw new LogicError(`The user with id ${id} is not the organizer ot this tournament`)
                if (tournament.winners.includes(firstTeamId)) {
                    if (tournament.winners.includes(secondTeamId)) {
                        for (let i = 0; i < tournament.winners.length; i++) {
                            if (tournament.winners[i] == firstTeamId) {
                                tournament.winners.splice(i, 1)
                            }
                            if (tournament.winners[i] == secondTeamId) {
                                tournament.winners.splice(i, 1)
                            }
                        }
                        return tournament.save()
                            .then(() => {
                                const match = { teams: [firstTeamId, secondTeamId] }
                                return Match.create(match)
                            })
                    } else throw new LogicError(`The team with id ${secondTeamId} does not participate in this tournament (3)`)
                } else throw new LogicError(`The team with id ${firstTeamId} does not participate in this tournament (4)`)
            })
            .then(match => {
                matchId = match.id
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                tournament.roundState = 'playing'
                if (!tournament.roundMatches) {
                    tournament.roundMatches = 1
                } else {
                    tournament.roundMatches = tournament.roundMatches + 1
                }
                tournament.matches.push(matchId)
                return tournament.save()
            })
            .then(() => {
                return true
            })
    },

    startTournament(id, tournamentId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if ((user.role[0] !== 'organizer') && (user.role[1] !== 'organizer') && (user.role[2] !== 'organizer')) throw new LogicError(`The user with id ${id} is has not any tournament created`)
                return Tournament.findOne({ '_id': tournamentId })

            })
            .then(tournament => {
                if (!tournament) throw new LogicError(`The tournament with id ${tournamentId} not exists on database`)
                if (tournament.organizer.toString() !== id) throw new LogicError(`The user with id ${id} is not the organizer of this tournament`)
                if (tournament.teams < 2) throw new LogicError(`The tournament with name ${tournament.name} needs at least two teams`)
                if (tournament.state === 'playing') throw new LogicError(`The tournament with name ${tournament.name} is already playing`)
                tournament.state = 'playing'
                tournament.roundMatches = 0
                for (let i = 0; i < tournament.teams.length; i++) {
                    tournament.winners.push(tournament.teams[i].toString())
                }
                return tournament.save()
            })
    },

    createNewRound(id, tournamentId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if ((user.role[0] !== 'organizer') && (user.role[1] !== 'organizer') && (user.role[2] !== 'organizer')) throw new LogicError(`The user with id ${id} is has not any tournament created`)
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {

                if (!tournament) throw new LogicError(`The tournament with id ${tournamentId} not exists on database`)
                if (tournament.organizer.toString() !== id) throw new LogicError(`The user with id ${id} is not the organizer of this tournament`)
                if (tournament.state !== 'playing') throw new LogicError(`The tournament with name ${tournament.name} it is in ${tournament.state} mode`)
                if (tournament.roundMatches > 0) throw new LogicError(`The tournament with name ${tournament.name} has not finished the previous round`)
                let knockouts = [2, 4, 8, 16, 32]
                let winners = tournament.winners
                if (knockouts.includes(winners.length)) {
                    switch (winners.length) {
                        case 2:
                            const [a1, a2] = this._random(winners)

                            return logic.createNewMatch(id, tournamentId, a1, a2)
                                .then(() => true)
                        case 4:
                            const [b1, b2] = this._random(winners)

                            return Promise.all([1, 2].map(ele => logic.createNewMatch(id, tournamentId, b1, b2))).then(() => true)

                        case 8:
                            const [c1, c2] = this._random(winners)

                            return Promise.all([1, 2, 3, 4].map(ele => logic.createNewMatch(id, tournamentId, c1, c2))).then(() => true)

                        case 16:
                            const [d1, d2] = this._random(winners)

                            return Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(ele => logic.createNewMatch(id, tournamentId, d1, d2))).then(() => true)

                        case 32:
                            const [e1, e2] = this._random(winners)

                            return Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(ele => logic.createNewMatch(id, tournamentId, e1, e2))).then(() => true)

                        default:
                            break
                    }
                } else {
                    let count
                    for (let i = 0; i < knockouts.length; i++) {
                        if (knockouts[i] < winners.length && winners.length < knockouts[i + 1]) {
                            count = knockouts[i]
                        }
                    }
                    let numOfMatches = winners.length - count
                    let match = []

                    for (let a = 0; a < numOfMatches; a++) {
                        match.push(a)
                    }

                    const [i1, i2] = this._random(winners)

                    return Promise.all(match.map(ele => logic.createNewMatch(id, tournamentId, i1, i2))).then(() => true)
                }
            })


    },

    retrieveMatch(id, matchId) {
        let resultId = '', matchData = {}
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(matchId)
                matchData.matchId = matchId
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user.role) throw new LogicError(`The user with id ${id} has not any permission`)
                return Match.findOne({ '_id': matchId })
            })
            .then(match => {
                matchData.teamId = match.teams[0].toString()
                matchData.team2Id = match.teams[1].toString()
                if (match.result.length > 0) resultId = match.result
                return logic.retrieveTeamData(id, match.teams[0].toString())
                    .then(team => {
                        matchData.team1name = team.name
                        return logic.retrieveTeamData(id, match.teams[1].toString())
                            .then(team => {
                                matchData.team2name = team.name
                                return true
                            })
                    })
            })
            .then(() => {
                if (resultId.length > 0) {
                    return Result.findOne({ '_id': resultId })
                }
            })
            .then(result => {
                if (result) matchData.goalsFirstTeam = result.goalsFirstTeam
                if (result) matchData.goalsSecondTeam = result.goalsSecondTeam
                return matchData
            })
    },

    listMatches(id, tournamentId) {
        let matchesIds = []
        let matchData = []
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user.role) throw new LogicError(`The user with id ${id} has not any permission`)
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                for (let i = 0; i < tournament.matches.length; i++) {
                    matchesIds.push(tournament.matches[i].toString())
                }
                return matchesIds
            })
            .then(matches => {
                let data = []

                for (let a = 0; a < matches.length; a++) {
                    data.push(a)
                }

                return Promise.all(data.map(num => {
                    return logic.retrieveMatch(id, matches[num])
                        .then(res => matchData.push(res))

                })).then(() => matchData)
            })

    },

    addResult(id, tournamentId, matchId, goalsFirstTeam, goalsSecondTeam) {
        let firstTeamId, secondTeamId, winnerTeam, resultId
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(matchId)
                this._validateNumberField('goals team 1', goalsFirstTeam)
                this._validateNumberField('goals team 2', goalsSecondTeam)
                if (goalsFirstTeam === goalsSecondTeam) throw new LogicError('One match does not finish on draw')
                return User.findOne({ '_id': id })
            })
            .then(user => {
                if (!user) throw new LogicError(`The user with id ${id} does not exist on database`)
                if (!user.role.includes('organizer')) throw new LogicError(`The user with id ${id} has not any tournament created`)
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                if (!tournament) throw new LogicError(`The tournament with id ${tournamentId} does not exists on database`)
                if (tournament.organizer.toString() !== id) throw new LogicError(`The user with id ${id} is not the organizer of this tournament`)
                if (tournament.state === 'creating') throw new LogicError(`The tournament with name ${tournament.name} has not started yet`)
                if (tournament.state === 'finish') throw new LogicError(`The tournament with name ${tournament.name} is finished`)
                // if (tournament.winners.length === 0) throw new LogicError(`The tournament with name ${tournament.name}) is finished`)
                if (tournament.roundMatches === 0) throw new LogicError(`This round is finished. You must start a new round`)
                // if (!tournament.matches.includes(matchId)) throw new LogicError(`This match does not belong to the tournament ${tournament.name}`)
                return Match.findOne({ '_id': matchId })
            })
            .then(match => {
                if (!match) throw new LogicError(`The match with id ${matchId} does not exists on this tournament`)
                firstTeamId = match.teams[0]._id
                secondTeamId = match.teams[1]._id
                const result = { firstTeamId, secondTeamId, goalsFirstTeam, goalsSecondTeam }
                return Result.create(result)
            })
            .then(result => {
                resultId = result.id
                if (goalsFirstTeam > goalsSecondTeam) winnerTeam = firstTeamId
                else winnerTeam = secondTeamId
                return Match.findOne({ '_id': matchId })
            })
            .then(match => {
                match.result = resultId
                match.save()
                return Tournament.findOne({ '_id': tournamentId })
            })
            .then(tournament => {
                tournament.roundMatches = tournament.roundMatches - 1
                debugger
                tournament.winners.push(winnerTeam.toString())
                if (tournament.winners.length === 1 && tournament.roundMatches === 0) {
                    tournament.state = 'finish'
                    return tournament.save()
                }
                return tournament.save()
            })
    },

}

class LogicError extends Error {
    constructor(message) {
        super(message)
    }
}

module.exports = { logic, LogicError }