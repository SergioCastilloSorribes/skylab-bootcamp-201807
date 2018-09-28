import React, { Component } from 'react'
import { withRouter, Switch } from 'react-router-dom'
import logic from '../logic'
import CreateTournament from '../components/Organizer/CreateTournament';
import ListMyTournaments from '../components/Organizer/ListMyTournaments';
import './styles/Organizer.css'
import Error from '../components/Error'

class Organizer extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        organizer: sessionStorage.getItem('organizer'),
        role: 'organizer',
        res: [],
        createTournamentError: '',
        listMyTournamentError: '',
        removeTournamentError: ''
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
            .catch(({ message }) => this.setState({ createTournamentError: message }))
    }

    handleListMyTournamentsAsOrganizer = () => {
        return logic.listMyTournamentsAsOrganizer(this.state.id, this.state.token)
            .catch(({ message }) => this.setState({ listMyTournamentError: message }))
    }

    handleGoToTournament = (tournamentId) => {
        this.props.handleGoToTournament(tournamentId, this.state.role)
    }

    handleRemoveTournament = (tournamentId) => {
        return logic.removeTournament(this.state.id, this.state.token, tournamentId)
            .catch(({ message }) => this.setState({ removeTournamentError: message }))
    }

    render() {
        return <article className="Organizer">
            <CreateTournament handleCreateTournament={this.handleCreateTournament} />
            {this.state.createTournamentError && <Error message={this.state.createTournamentError} />}
            {this.isOrganizerIn() && <ListMyTournaments handleListMyTournamentsAsOrganizer={this.handleListMyTournamentsAsOrganizer} handleGoToTournament={this.handleGoToTournament} handleRemoveTournament={this.handleRemoveTournament} />}
            {this.state.listMyTournamentError && <Error message={this.state.listMyTournamentError} />}
            {this.state.removeTournamentError && <Error message={this.state.removeTournamentError} />}
        </article>
    }

}

export default withRouter(Organizer)