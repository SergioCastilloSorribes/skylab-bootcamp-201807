import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import Feedback from '../Feedback'


class TeamsList extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        role: sessionStorage.getItem('role'),
        tournamentId: sessionStorage.getItem('tournamentId'),
        tournament: [],
        teams: []
    }

    componentDidMount() {
        this.props.handleListTeamsFromTournament()
            .then(teams => {
                this.setState({ teams })
            })
    }

    componentWillReceiveProps(){
        this.props.handleListTeamsFromTournament()
            .then(teams => {
                this.setState({ teams })
            })
    }

    handleRemoveTeamFromTournament = (e, teamId) => {
        e.preventDefault()
        logic.removeTeamFromTournament(this.state.id, this.state.token, this.state.tournamentId, teamId)
    }

    render() {
        return <div>
            <ul>
                {this.state.teams.map(team => <li key={team._id}> {team.name} {team.description} {this.state.role === 'organizer' && <a href="" onClick={(e) => this.handleRemoveTeamFromTournament(e, team._id)}>[remove team from tournament]</a>}</li>)}
            </ul>
        </div>
    }
}
export default withRouter(TeamsList)