require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { logic, LogicError } = require('./logic')
const jwt = require('jsonwebtoken')
const validateJwt = require('./helpers/validate-jwt')
const jsonBodyParser = bodyParser.json({limit: '10mb'});

const router = express.Router()

// const jsonBodyParser = bodyParser.json()

// USER ROUTES

// Register User: add an user with email and password to database USER

router.post('/register', jsonBodyParser, (req, res) => {
    const { body: { email, password } } = req

    logic.register(email, password)
        .then(() => res.status(201).json({ message: 'user registered' }))
        .catch(err => {
            const { message } = err

            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })

})

// Authenticate user: validate the user and retrieve an id and a token

router.post('/authenticate', jsonBodyParser, (req, res) => {
    const { body: { email, password } } = req

    logic.authenticate(email, password)
        .then(id => {
            const { JWT_SECRET, JWT_EXP } = process.env

            const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: JWT_EXP })

            res.json({ message: 'user authenticated', token, id })
        })
        .catch(err => {
            const { message } = err

            res.status(err instanceof LogicError ? 401 : 500).json({ message })
        })
})

// Update User: change the user's password

router.put('/user/:id/update', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id }, body: { password, newPassword } } = req

    logic.updatePassword(id, password, newPassword)
        .then(() => res.json({ message: 'user updated' }))
        .catch(err => {
            const { message } = err

            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Unregister user: delete the user from the database USER

router.delete('/user/:id/unregister', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id }, body: { password } } = req

    logic.unregister(id, password)
        .then(() => res.json({ message: 'user unregistered' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// PLAYER ROUTES

// Retrieve the user roles

router.get('/user/:id/retrieveroles', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id } } = req

    logic.retrieveUserRoles(id)
        .then(roles => res.json({ message: 'Retrieve roles correctly', roles }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Add user as a player

router.post('/user/:id/addroleplayer', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id }, body: { dni, name, surname, age, gender, height, weight, position, squadNumber, photo } } = req

    logic.iWantToBeAPlayer(id, dni, name, surname, age, gender, height, weight, position, squadNumber, photo)
        .then(() => res.json({ message: 'Role player added correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Retrieve the player data

router.get('/user/:id/retrieveplayer', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, playerid } } = req

    logic.retrievePlayer(id)
        .then(user => res.json({ message: 'Retrieve user correctly', user }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// List my teams as player

router.get('/user/:id/listmyteamsasplayer', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id } } = req

    logic.listMyTeamsAsPlayer(id)
        .then(teams => res.json({ message: 'List all teams correctly', teams }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// List my tournaments as player

router.get('/user/:id/:teamId/listmytournamentsasplayer', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, teamid } } = req

    logic.listMyTeamsAsPlayer(id)
        .then(teams => res.json({ message: 'List all tournaments correctly', teams }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Remove the user as a player

router.put('/user/:id/removeroleplayer', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id } } = req

    logic.iDontWantToBeAPlayer(id)
        .then(() => res.json({ message: 'Player role removed' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})




// Create a new team on database TEAM with an user id

router.post('/user/:id/createteam', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id }, body: { name, description, owner } } = req

    logic.createTeam(id, name, description, owner)
        .then(() => res.json({ message: 'Team created' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Retrieve all the manager teams

router.get('/user/:id/listmyteamsasmanager', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id } } = req

    logic.listMyTeamsAsManager(id)
        .then(teams => res.json({ message: 'List all teams correctly', teams }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// search players by query


router.get('/user/:id/searchplayersbyquery', (req, res) => {
    const { params: { id } } = req
    const { name, surname, dni } = req.query

    return logic.searchPlayersByQuery(id, name, surname, dni)
        .then((data) => res.json(data))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Retrieve team data

router.get('/user/:id/team/:teamId/retrieveteam', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, teamId } } = req

    logic.retrieveTeamData(id, teamId)
        .then(team => res.json({ message: 'Retrieve team correctly' , team}))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Add player to team

router.put('/user/:id/team/:teamid/player/:playerid/add', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, teamid, playerid } } = req

    logic.addPlayerToTeam(id, teamid, playerid)
        .then(() => res.json({ message: 'Player added' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// List the players of the team

router.get('/user/:id/team/:teamId/listplayersfromteam', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, teamId } } = req

    logic.listPlayersFromTeam(id, teamId)
        .then(team => res.json({ message: 'Retrieve players team correctly' , team}))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Remove a player from a team

router.delete('/user/:id/team/:teamid/player/:playerid/remove', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, teamid, playerid } } = req

    logic.removePlayerFromATeam(id, teamid, playerid)
        .then(() => res.json({ message: 'Player removed' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Remove a team of a manager

router.delete('/user/:id/team/:teamid/remove', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, teamid } } = req

    logic.removeTeam(id, teamid)
        .then(() => res.json({ message: 'Team removed correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Create a new tournament on database TOURNAMENT with an user id

router.post('/user/:id/createtournament', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id }, body: { nameTournament } } = req

    logic.createTournament(id, nameTournament)
        .then(() => res.json({ message: 'Tournament created' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Retrieve all the organizer tournaments

router.get('/user/:id/listmytournamentsasorganizer', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id } } = req

    logic.listMyTournamentsAsOrganizer(id)
        .then(tournaments => res.json({ message: 'List all tournaments correctly', tournaments }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Retrieve tournament data

router.get('/user/:id/tournament/:tournamentId/retrievetournament', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, tournamentId } } = req

    logic.retrieveTournamentData(id, tournamentId)
        .then(tournament => res.json({ message: 'Retrieve tournament correctly' , tournament}))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// List the teams from a tournament

router.get('/user/:id/tournament/:tournamentId/listteamsfromtournament', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, tournamentId } } = req

    logic.listTeamsFromTournament(id, tournamentId)
        .then(teams => res.json({ message: 'Retrieve players team correctly' , teams}))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// List all the teams

router.get('/user/:id/listalltheteamsasorganizer', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id } } = req

    logic.listAllTeamsAsOrganizer(id)
        .then(teams => res.json({ message: 'List all teams correctly', teams }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Add Team to Tournament

router.put('/user/:id/tournament/:tournamentid/team/:teamid/add', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, tournamentid, teamid } } = req

    logic.addTeamToTournament(id, tournamentid, teamid)
        .then(() => res.json({ message: 'Add team correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Remove Team from Tournament

router.delete('/user/:id/tournament/:tournamentid/team/:teamid/remove', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, tournamentid, teamid } } = req

    logic.removeTeamFromTournament(id, tournamentid, teamid)
        .then(() => res.json({ message: 'Remove team correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Remove a tournament on database TOURNAMENT with an organizer id

router.delete('/user/:id/tournament/:tournamentId/remove', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, tournamentId } } = req

    logic.removeTournament(id, tournamentId)
        .then(() => res.json({ message: 'Tournament removed' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Start Tournament

router.put('/user/:id/tournament/:tournamentId/starttournament', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, tournamentId } } = req

    logic.startTournament(id, tournamentId)
        .then(() => res.json({ message: 'Start tournament correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Create New Round

router.put('/user/:id/tournament/:tournamentId/createnewround', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, tournamentId } } = req
    logic.createNewRound(id, tournamentId)
        .then(() => res.json({ message: 'Create new round correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// List all the matches

router.get('/user/:id/tournament/:tournamentId/listmatches', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, tournamentId } } = req

    logic.listMatches(id, tournamentId)
        .then(matchData => res.json({ message: 'List all matches correctly', matchData }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Add a result

router.post('/user/:id/tournament/:tournamentId/match/:matchId/addresult', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { id, tournamentId, matchId }, body: { goalsFirstTeam, goalsSecondTeam } } = req

    logic.addResult(id, tournamentId, matchId, goalsFirstTeam, goalsSecondTeam)
        .then(() => res.json({ message: 'Result added correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

// Add photo to Cloudinary

router.patch('/upload', jsonBodyParser, (req, res) => {
    const { body: { base64Image } } = req;
  
    return logic._saveImage(base64Image)
      .then(photo => res.status(200).json({ status: 'OK', photo }))
      .catch((err) => {
        const { message } = err;
        res.status(err instanceof LogicError ? 400 : 500).json({ message });
      });
  }); 

module.exports = router
