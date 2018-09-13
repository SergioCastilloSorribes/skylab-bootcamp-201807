import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import Feedback from '../Feedback'


class Squad extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        role: sessionStorage.getItem('role'),
        teamId: sessionStorage.getItem('teamId'),
        squad: [],
        players: []
    }

    componentDidMount() {
        this.props.handleListPlayersFromTeam()
            .then(({ team }) => {
                this.setState({ squad: team })
            })
    }

    handleRemovePlayerFromTeam = (e, playerId) => {
        e.preventDefault()
       logic.removePlayerFromTeam(this.state.id, this.state.token, this.state.teamId, playerId)
    }

    render() {
        return <div>
            <ul>
                {this.state.squad.map(player => <li key={player._id}> {player.name} {player.surname} {this.state.role==='manager' && <a href="" onClick={(e)=>this.handleRemovePlayerFromTeam(e, player._id)}>[remove player from team]</a>}</li>)}
            </ul>
        </div>
    }
}
export default withRouter(Squad)