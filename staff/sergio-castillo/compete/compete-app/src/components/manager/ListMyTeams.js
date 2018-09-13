import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'

class ListMyTeams extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        teams: [],
        refresh: ""
    }

    componentDidMount() {
        this.props.handleListMyTeamsAsManager()
            .then(teams => {
                this.setState({
                    teams
                })
            })

    }

    removeTeam = (teamid) => {
        this.props.handleRemoveTeam(teamid)
            .then(() => {
                this.setState({
                    refresh: ""
                })
                this.props.handleListMyTeamsAsManager()
                    .then(teams => {
                        this.setState({
                            teams
                        })
                    })
            })
    }

    handleGoToTeam = (e, teamId) => {
        e.preventDefault()
        this.props.handleGoToTeam(teamId)
    }


    render() {

        return <div>
            <h1>LIST MY TEAMS</h1>
            {this.state.teams.map(team => <li key={team._id}><a href="" onClick={(e) => this.handleGoToTeam(e, team._id)}>{team.name}</a>  <a href="" onClick={(e) => { e.preventDefault(); this.removeTeam(team.id) }} >[x]</a></li>)}
        </div>
    }
}

export default withRouter(ListMyTeams)