const logic = {
    // url: 'http://localhost:8080/api',
    url: 'https://competeapi.herokuapp.com/api',

    _call(path, method, headers, body, expectedStatus) {
        const config = { method }
        if (headers) config.headers = headers
        if (body) config.body = body

        return fetch(`${this.url}/${path}`, config)
            .then(res => {
                if (res.status === expectedStatus) {
                    return res
                } else
                    return res.json()
                        .then(({ message }) => {
                            throw new Error(message)
                        })
            })
    },

    _validateStringField(fieldName, fieldValue) {
        if (typeof fieldValue !== 'string' || !fieldValue.length) throw new Error(`This is an invalid ${fieldName}`)
    },

    _validateLengthPassword(password) {
        if (password.length < 6) throw new Error('This password is too short. Please introduce 6 characters at least')
    },

    _validateIdField(id) {
        if (!id) throw new Error('This is an invalid id')
        if (!isNaN(id)) throw new Error('This is an invalid id')
    },

    _validateNumberField(name, value) { // TEST CORRECT
        if (isNaN(value) || typeof value === 'string') throw new Error(`This is an invalid ${name}`)
    },

    // USER METHODS

    register(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField('email', email)
                this._validateStringField('password', password)
                this._validateLengthPassword(password)

                return this._call('register', 'post', {
                    'Content-Type': 'application/json'
                }, JSON.stringify({ email, password }), 201)
                    .then(() => true)
            })
    },

    authenticate(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField('email', email)
                this._validateStringField('password', password)

                return this._call('authenticate', 'post', {
                    'Content-Type': 'application/json'
                }, JSON.stringify({ email, password }), 200)
                    .then(res => res.json())
                    .then((res) => res)
                // Recoger todos los catch en los métodos para capturar los errores
            })
    },

    updateProfile(id, token, password, newPassword) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                if (!token) throw new Error('This is an invalid token')

                return this._call(`user/${id}/update`, 'put',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , JSON.stringify({ password, newPassword }), 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    unregisterUser(id, token, password) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                if (!token) throw new Error('This is an invalid token')

                return this._call(`user/${id}/unregister`, 'delete',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , JSON.stringify({ password }), 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    // PLAYER METHODS

    addPlayerRole(id, token, dni, name, surname, age, gender, height, weight, position, squadNumber, photo) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateStringField('dni', dni)
                if (dni.length < 9) throw new Error(`The dni ${dni} is not a correct dni`)
                this._validateStringField('name', name)
                this._validateStringField('surname', surname)
                this._validateNumberField('age', age)
                if ((age < 14) || (age > 70)) throw new Error('This is an inadequate age')
                this._validateStringField('gender', gender)
                if ((gender !== 'male') && (gender !== 'female') && (gender !== 'other')) throw new Error('This is an invalid gender')
                this._validateNumberField('height', height)
                if ((height < 130) || (height > 250)) throw new Error('This is an inadequate height')
                this._validateNumberField('weight', weight)
                if ((weight < 45) || (weight > 130)) throw new Error('This is an inadequate weight')
                this._validateStringField('position', position)
                this._validateNumberField('squad number', squadNumber)
                if ((squadNumber < 1) || (squadNumber > 99)) throw new Error('This is an inadequate squad number')
                this._validateStringField('photo', photo)

                return this._call(`user/${id}/addroleplayer`, 'post',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , JSON.stringify({ dni, name, surname, age, gender, height, weight, position, squadNumber, photo }), 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    retrieveUserRoles(id, token) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)

                return this._call(`user/${id}/retrieveroles`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    retrievePlayer(id, token) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)

                return this._call(`user/${id}/retrieveplayer`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    listMyTeamsAsPlayer(id, token) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)

                return this._call(`user/${id}/listmyteamsasplayer`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    listMyTournamentsAsPlayer(id, token, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)

                return this._call(`user/${id}/${teamId}/listmytournamentsasplayer`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    removePlayerRole(id, token) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)

                return this._call(`user/${id}/removeroleplayer`, 'put',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    // TEAM METHODS

    createTeam(id, token, name, description, owner) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateStringField('name', name)
                this._validateStringField('description', description)
                this._validateStringField('owner', owner)

                return this._call(`user/${id}/createteam`, 'post',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , JSON.stringify({ name, description, owner }), 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    listMyTeamsAsManager(id, token) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)

                return this._call(`user/${id}/listmyteamsasmanager`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(({ teams }) => teams)
            })
    },

    retrieveTeam(id, token, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)

                return this._call(`user/${id}/team/${teamId}/retrieveteam`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(({ team }) => team)
            })
    },

    listPlayersFromTeam(id, token, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)

                return this._call(`user/${id}/team/${teamId}/listplayersfromteam`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    searchPlayerByQuery(id, token, name, surname, dni) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)

                return this._call(`user/${id}/searchplayersbyquery?dni=${dni}`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    addPlayerToTeam(id, token, teamId, playerId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)
                this._validateIdField(playerId)

                return this._call(`user/${id}/team/${teamId}/player/${playerId}/add`, 'put',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    removePlayerFromTeam(id, token, teamId, playerId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamId)
                this._validateIdField(playerId)

                return this._call(`user/${id}/team/${teamId}/player/${playerId}/remove`, 'delete',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    removeTeam(id, token, teamid) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(teamid)

                return this._call(`user/${id}/team/${teamid}/remove`, 'delete',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    // TOURNAMENT METHODS

    createTournament(id, token, nameTournament) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateStringField('nameTournament', nameTournament)

                return this._call(`user/${id}/createtournament`, 'post',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , JSON.stringify({ nameTournament }), 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    listMyTournamentsAsOrganizer(id, token) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)

                return this._call(`user/${id}/listmytournamentsasorganizer`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(({ tournaments }) => tournaments)
            })
    },

    retrieveTournament(id, token, tournamentId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)

                return this._call(`user/${id}/tournament/${tournamentId}/retrievetournament`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(({ tournament }) => tournament)
            })
    },

    listTeamsFromTournament(id, token, tournamentId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)

                return this._call(`user/${id}/tournament/${tournamentId}/listteamsfromtournament`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(({ teams }) => teams)
            })
    },

    listAllTeamsAsOrganizer(id, token) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)

                return this._call(`user/${id}/listalltheteamsasorganizer`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(({ teams }) => teams)
            })
    },

    addTeamToTournament(id, token, tournamentId, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                this._validateIdField(teamId)
                return this._call(`user/${id}/tournament/${tournamentId}/team/${teamId}/add`, 'put',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    removeTeamFromTournament(id, token, tournamentId, teamId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                this._validateIdField(teamId)
                return this._call(`user/${id}/tournament/${tournamentId}/team/${teamId}/remove`, 'delete',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    removeTournament(id, token, tournamentId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)

                return this._call(`user/${id}/tournament/${tournamentId}/remove`, 'delete',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    startTournament(id, token, tournamentId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                this._validateIdField(tournamentId)
                return this._call(`user/${id}/tournament/${tournamentId}/starttournament`, 'put',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    createNewRound(id, token, tournamentId) {
        debugger
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)
                return this._call(`user/${id}/tournament/${tournamentId}/createnewround`, 'put',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    listMatches(id, token, tournamentId) {
        return Promise.resolve()
            .then(() => {
                this._validateIdField(id)

                return this._call(`user/${id}/tournament/${tournamentId}/listmatches`, 'get',
                    { authorization: `bearer ${token}`, 'content-type': 'application/json' }
                    , undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    addResult(id, token, tournamentId, matchId, goalsFirstTeam, goalsSecondTeam){
        return Promise.resolve()
        .then(() => {
            this._validateIdField('id', id)

            return this._call(`user/${id}/tournament/${tournamentId}/match/${matchId}/addresult`, 'post', 
            { authorization: `bearer ${token}`, 'content-type': 'application/json'
            }, JSON.stringify({ goalsFirstTeam, goalsSecondTeam }), 200)
                .then(res => res.json())
                .then((res) => res)
        })
    },

}

module.exports = logic