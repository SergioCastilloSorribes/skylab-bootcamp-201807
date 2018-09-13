import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Squad from './team/Squad'
import AddPlayerToTeam from './team/AddPlayerToTeam'
import logic from '../logic'
import Feedback from './Feedback'


class Team extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        role: sessionStorage.getItem('role'),
        teamId: sessionStorage.getItem('teamId'),
        team: [],
        squad: []
    }

    componentDidMount() {
        this.props.handleRetrieveTeam()
            .then(team => {
                this.setState({ team })
            })
    }

    componentWillUnmount() {
        sessionStorage.removeItem('role', "")
        sessionStorage.removeItem('teamId', "")
    }

    handleListPlayersFromTeam = () => {
        return logic.listPlayersFromTeam(this.state.id, this.state.token, this.state.teamId)
    }

    render() {
        return <div>
            <h3>{this.state.team.name}</h3>
            <p>{this.state.team.description}</p>
            <Squad handleListPlayersFromTeam={this.handleListPlayersFromTeam} />
            <AddPlayerToTeam />
        </div>
    }
}
export default withRouter(Team)