import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import AddPlayer from '../components/Player/AddPlayer'
import PlayerData from '../components/Player/PlayerData'
import Error from '../components/Error'
import ListMyTeamsAsPlayer from '../components/Player/ListMyTeamsAsPlayer'
import ListMyTournamentsAsPlayer from '../components/Player/ListMyTournamentsAsPlayer'
import './styles/Player.css'

// PROBLEM => Tengo un bug porque cuando elimino el usuario como jugador se mantienen los campos, 
// entonces si quiero subir la misma foto me da un error de this is invalid photo.


class Player extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        user: [],
        teams: false,
        tournaments: false,
        addPlayerError: "",
        removePlayerError: "",
        role: 'player',
        retrievePlayerError:'',
        listMyTeamsError:''
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
                this.setState({ addPlayerError: "" })
            })
            .catch(({ message }) => this.setState({ addPlayerError: message }))
    }

    handleRetrievePlayer = () => {
        return logic.retrievePlayer(this.state.id, this.state.token)
            .catch(({message})=> this.setState({retrievePlayerError: message}))
    }

    handleListMyTeamsAsPlayer = () => {
        return logic.listMyTeamsAsPlayer(this.state.id, this.state.token)
            .then(res => {
                if (res.teams.length > 0) this.setState({ teams: true })
                return res
            })
            .catch(({message})=> this.setState({listMyTeamsError: message}))
    }

    handleRemovePlayer = (e) => {
        e.preventDefault()
        logic.removePlayerRole(this.state.id, this.state.token)
            .then(() => {
                sessionStorage.setItem('player', false)
                this.setState({ player: sessionStorage.getItem('player') })
            })
            .catch(({ message }) => {
                this.setState({ removePlayerError: message })
            })
    }

    handleGoToTeam = (teamId) => {
        this.props.handleGoToTeam(teamId, this.state.role)
    }

    render() {
        return <article className="Player">
            {!this.isPlayerIn() && <AddPlayer handleAddPlayer={this.handleAddPlayer} message={this.state.addPlayerError} />}
            {this.state.addPlayerError && <Error message={this.state.addPlayerError} />}
            {this.isPlayerIn() && <PlayerData handleRetrievePlayer={this.handleRetrievePlayer} handleRemovePlayer={this.handleRemovePlayer}/>}
            {this.state.retrievePlayerError && <Error message={this.state.retrievePlayerError} />}
            {this.state.removePlayerError && <Error message={this.state.removePlayerError} />}
            {this.isPlayerIn() && <ListMyTeamsAsPlayer handleListMyTeamsAsPlayer={this.handleListMyTeamsAsPlayer} handleGoToTeam={this.handleGoToTeam} />}
            {this.state.listMyTeamsError && <Error message={this.state.listMyTeamsError} />}
        </article>
    }
}
export default withRouter(Player)