import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import TeamsList from './tournament/TeamsList'
import AddTeamToTournament from './tournament/AddTeamToTournament'
import Winner from './tournament/Winner'
import logic from '../logic'
import Feedback from './Feedback'
import Matches from './tournament/Matches'


class Tournament extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        tournamentId: sessionStorage.getItem('tournamentId'),
        role: sessionStorage.getItem('role'),
        tournament: [],
        matches: [],
        winners: []
    }

    componentDidMount() {
        this.props.handleRetrieveTournament()
            .then(tournament => {
                this.setState({ tournament })
            })
    }

    handleListTeamsFromTournament = () => {
        return this.props.handleListTeamsFromTournament()
    }

    handleStartTournament = () => {
       logic.startTournament(this.state.id, this.state.token, this.state.tournamentId)
    }

    handleCreateNewRound = () => {
        logic.createNewRound(this.state.id, this.state.token, this.state.tournamentId)
    }

    handleListMatches = () => {
        return logic.listMatches(this.state.id, this.state.token, this.state.tournamentId)
    }

    render() {
        return <div>
            <h4>{this.state.tournament.nameTournament}</h4>
            <p>State: {this.state.tournament.state}</p>
            {this.state.tournament.state==='creating' && <TeamsList handleListTeamsFromTournament={this.handleListTeamsFromTournament} />}
            {this.state.tournament.state==='creating' && <AddTeamToTournament />}
            {this.state.tournament.state==='creating' && <button type="submit" onClick={this.handleStartTournament}>Start Tournament</button>}
            {this.state.tournament.state==='playing' && this.state.tournament.roundMatches===0 && <button type="submit" onClick={this.handleCreateNewRound}>Create New Round</button>}
             <Matches handleListMatches={this.handleListMatches}/>
            {this.state.winners.length===1 && <Winner winner={this.state.winners}/>}
        </div>
    }
}
export default withRouter(Tournament)