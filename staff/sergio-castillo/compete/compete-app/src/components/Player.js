import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import AddPlayer from './player/AddPlayer'
import PlayerData from './player/PlayerData'
import Feedback from './Feedback'
import ListMyTeamsAsPlayer from './player/ListMyTeamsAsPlayer'

class Player extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        user: [],
        teams: false,
        tournaments: false,
        feedbackAddPlayer: "",
        feedbackRemoveRole: "",
        role: 'player'
    }

    isPlayerIn = () => {
        if (this.state.player === 'true') {
            return true
        } else {
            return false
        }
    }
    isTeamsIn = () => {
        if (this.state.teams === 'true') {
            return true
        } else {
            return false
        }
    }
    isTournamentsIn = () => {
        if (this.state.tournaments === 'true') {
            return true
        } else {
            return false
        }
    }

    handleAddPlayer = (dni, name, surname, age, gender, height, weight, position, squadnumber, photo) => {
        return logic.addPlayerRole(this.state.id, this.state.token, dni, name, surname, age, gender, height, weight, position, squadnumber, photo)
            .then(() => {
                sessionStorage.setItem('player', true)
                this.setState({ player: sessionStorage.getItem('player') })
            })
            .catch(({ message }) => this.setState({ feedbackAddPlayer: message }))
    }

    handleRetrievePlayer = () => {
        return logic.retrievePlayer(this.state.id, this.state.token)
    }

    handleListMyTeamsAsPlayer = () => {
        return logic.listMyTeamsAsPlayer(this.state.id, this.state.token)
            .then(res => {
                if (res.teams.length > 0) this.setState({ teams: true })
                return res
            })
    }

    handleRemovePlayer = (e) => {
        e.preventDefault()
        logic.removePlayerRole(this.state.id, this.state.token)
            .then(() => {
                sessionStorage.setItem('player', false)
                this.setState({ player: sessionStorage.getItem('player') })
            })
            .catch(({ message }) => {
                this.setState({ feedbackRemoveRole: message })
            })
    }

    handleGoToTeam = (teamId) => {
        this.props.handleGoToTeam(teamId, this.state.role)
    }

    render() {
        return <div>
            <h1>User</h1>
            {!this.isPlayerIn() && <AddPlayer handleAddPlayer={this.handleAddPlayer} />}
            {!this.isPlayerIn() && <Feedback message={this.state.feedbackAddPlayer} />}
            {this.isPlayerIn() && <PlayerData handleRetrievePlayer={this.handleRetrievePlayer} />}
            {this.isPlayerIn() &&  <ListMyTeamsAsPlayer handleListMyTeamsAsPlayer={this.handleListMyTeamsAsPlayer} handleGoToTeam={this.handleGoToTeam} />}
            {this.isPlayerIn() && <a href="" onClick={this.handleRemovePlayer}>Remove user as a player</a>}
            {this.isPlayerIn() && <Feedback message={this.state.feedbackRemoveRole} />}
        </div>
    }
}
export default withRouter(Player)