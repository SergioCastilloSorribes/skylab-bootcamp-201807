import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'

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
        this.props.handleAddTeamToTournament(teamId)
    }

    render() {
        return <div>
            <div className="col-8" style={{width: '22%', margin: '50px auto 0 auto'}}>
            {this.state.role === 'organizer' && <form onSubmit={this.handleListTeams}>
                <input style={{margin: '0 auto 20px auto'}} className="form-control" type="text" name="name" placeholder="Introduce name" value={this.state.name} onChange={this.handleChange} />
                <button className="btn btn-primary" type="submit">Search Teams</button>
            </form>}
            {this.state.role==='organizer' && <ul style={{margin: '50px 0', listStyle: 'none', textAlign: 'left'}}>
                {this.state.teams.map(team => <li style={{padding: '0'}} key={team.id}>{team.name} <a href="" onClick={(e) => this.handleAddTeamToTournament(e, team.id)}>Add to tournament</a> </li>)}
            </ul>}
            </div>
        </div>
    }
}
export default withRouter(AddTeamToTournament)