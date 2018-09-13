import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import Feedback from '../Feedback'


class AddTeamToTournament extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        tournamentId: sessionStorage.getItem('tournamentId'),
        teams: [],
        name:"",
        role: ""
    }

    componentDidMount() {
        this.setState({ role: sessionStorage.getItem('role') })
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleListTeams = (e) => {
        e.preventDefault()
        logic.listAllTeamsAsOrganizer(this.state.id, this.state.token)
        .then(teams=> {
            this.setState({teams})
        })
    }

    handleAddTeamToTournament = (e, teamId) => {
        e.preventDefault()
        logic.addTeamToTournament(this.state.id, this.state.token, this.state.tournamentId, teamId)
    }

    render() {
        return <div>
            {this.state.role === 'organizer' && <form onSubmit={this.handleListTeams}>
                <input type="text" name="name" placeholder="Introduce name" value={this.state.name} onChange={this.handleChange} />
                <button type="submit">Search Teams</button>
            </form>}
            {this.state.role==='organizer' && <ul>
                {this.state.teams.map(team => <li key={team.id}>{team.name} <a href="" onClick={(e) => this.handleAddTeamToTournament(e, team.id)}>Add to tournament</a> </li>)}
            </ul>}
        </div>
    }
}
export default withRouter(AddTeamToTournament)