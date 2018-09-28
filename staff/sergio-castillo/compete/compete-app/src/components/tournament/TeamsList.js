import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import './TeamList.css'
import Error from '../Error'

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
        teams: [],
        feedback:''
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
            .catch(({message})=>this.setState({ feedback: message }))
    }

    render() {

        return <aside className="ListMyTeams">
            <div className="ListMyTeams-title-wraper">
                <h3 className="ListMyTeams-title">Teams at tournament</h3>
            </div>
            <div className="ListMyTeams-field">
                {
                    this.state.teams.map(team =>
                        <div className="ListMyTeams-input">
                            <a href="" className="ListMyTeams-input-text">{team.name}</a>
                            {this.state.role==='organizer' && <a href="#" className="ListMyTeams-input-delete" onClick={(e) => this.handleRemoveTeamFromTournament(e, team._id)}>[x]</a>}
                        </div>
                    )
                }
                {this.state.feedback && <Error message={this.state.feedback} />}
            </div>
        </aside>
    }
}
export default withRouter(TeamsList)