import React, { Component } from 'react'
import { withRouter, Switch } from 'react-router-dom'
import logic from '../logic'
import CreateTournament from './organizer/CreateTournament';
import ListMyTournaments from './organizer/ListMyTournaments';
import Feedback from './Feedback'

class Organizer extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        organizer: sessionStorage.getItem('organizer'),
        role:'organizer',
        res:[]
    }

    isOrganizerIn = () => {
        if (this.state.organizer === 'true') {
            return true
        } else {
            return false
        }
    }

    handleCreateTournament = (name) => {
        debugger
        const { id, token } = this.state
        logic.createTournament(id, token, name)
            .then(() => {
                sessionStorage.setItem('organizer', true)
                this.setState({ organizer: sessionStorage.getItem('organizer') })
                this.handleListMyTournamentsAsOrganizer()
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