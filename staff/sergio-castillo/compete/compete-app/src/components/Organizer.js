import React, { Component } from 'react'
import { withRouter, Switch } from 'react-router-dom'
import logic from '../logic'
import CreateTournament from './organizer/CreateTournament';
import ListMyTournaments from './organizer/ListMyTournaments';

class Organizer extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        organizer: sessionStorage.getItem('organizer'),
        role:'organizer'
    }

    isOrganizerIn = () => {
        if (this.state.organizer === 'true') {
            return true
        } else {
            return false
        }
    }

    handleCreateTournament = (name) => {
        const { id, token } = this.state
        logic.createTournament(id, token, name)
            .then(res => {
                sessionStorage.setItem('organizer', true)
                this.setState({ player: sessionStorage.getItem('organizer') })
                this.handleListMyTournamentsAsOrganizer()
                return res
            })
    }

    handleListMyTournamentsAsOrganizer = () => {
        return logic.listMyTournamentsAsOrganizer(this.state.id, this.state.token)
    }

    handleGoToTournament = (tournamentId) => {
        this.props.handleGoToTournament(tournamentId, this.state.role)
    }

    handleRemoveTournament = (tournamentId) => {
        return logic.removeTournament(this.state.id, this.state.token, tournamentId)
    }

    render() {
        return <div>
            <CreateTournament handleCreateTournament={this.handleCreateTournament} />
            {this.isOrganizerIn() && <ListMyTournaments handleListMyTournamentsAsOrganizer={this.handleListMyTournamentsAsOrganizer} handleGoToTournament={this.handleGoToTournament} handleRemoveTournament={this.handleRemoveTournament} />}
            <Switch>

            </Switch>
        </div>
    }

}

export default withRouter(Organizer)