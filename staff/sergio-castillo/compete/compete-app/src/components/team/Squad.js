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

    componentWillReceiveProps() {
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

        return <div className="container">
            <div className="row">
                <div className="col-12">
                    <h3>SQUAD</h3>
                    {this.state.squad.map(player => <div className="message-header"><a href="#" className="list-group-item list-group-item-action">{player.dni} {player.name} {player.surname} {player.position}</a><button className="btn btn-danger" onClick={(e) => this.handleRemovePlayerFromTeam(e, player._id)}>x</button></div>
                    )}

                </div>
            </div>
        </div>
    }
}
export default withRouter(Squad)