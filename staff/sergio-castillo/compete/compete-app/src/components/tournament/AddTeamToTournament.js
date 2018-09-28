import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import Error from '../Error'
import './AddTeamToTournament.css'

class AddTeamToTournament extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        tournamentId: sessionStorage.getItem('tournamentId'),
        teams: [],
        name: "",
        role: "",
        listAllTeamsError:''
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
            .then(teams => {
                this.setState({ teams })
            })
            .catch(({ message }) => this.setState({ listAllTeamsError: message }))
    }

    handleAddTeamToTournament = (e, teamId) => {
        e.preventDefault()
        this.props.handleAddTeamToTournament(teamId)
    }

    render() {

        return <aside className="AddTeamToTournament">
            <div className="AddTeamToTournament-title-wraper">
                <h3 className="AddTeamToTournament-title">Teams</h3>
            </div>
            <div className="AddTeamToTournament-field">
                {this.state.role === 'organizer' && <form onSubmit={this.handleListTeams}>
                    <button className="listallteams is-primary is-fullwidt" type="submit">List all teams</button>
                </form>}
                {this.state.role === 'organizer' && <div>
                    {
                        this.state.teams.map(team =>
                            <div className="ListMyTeams-input">
                                <a href="#" className="ListMyTeams-input-text" onClick={(e) => this.handleAddTeamToTournament(e, team.id)}>{team.name}</a>
                            </div>
                        )
                    }            </div>}
            </div>
            {this.state.listAllTeamsError && <Error message={this.state.listAllTeamsError} />}
        </aside>
    }
}
export default withRouter(AddTeamToTournament)