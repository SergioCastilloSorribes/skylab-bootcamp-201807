import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import './Squad.css'
import Error from '../Error'


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
        players: [],
        removePlayerError: ''
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

    handleRemovePlayerFromTeam = (event, playerId) => {
        event.preventDefault()
        logic.removePlayerFromTeam(this.state.id, this.state.token, this.state.teamId, playerId)
            .catch(({ message }) => this.setState({ removePlayerError: message }))
    }

    render() {

        return <aside className="ListMyTeams">
            <div className="ListMyTeams-title-wraper">
                <h3 className="ListMyTeams-title">My squad</h3>
            </div>
            <div className="ListMyTeams-field">
                {
                    this.state.squad.map(player =>
                        <div className="ListMyTeams-input">
                            <img className="ListMyTeams-input-photo" src={player.photo} />
                            <a href="" className="ListMyTeams-input-text">{player.squadNumber}.  {player.name} {player.surname}  /  {player.position}</a>
                            <a href="#" className="ListMyTeams-input-delete" onClick={(event) => this.handleRemovePlayerFromTeam(event, player._id)}>[x]</a>
                        </div>
                    )
                }
                {this.state.removePlayerError && <Error message={this.state.removePlayerError}/>}
            </div>
        </aside>
    }
}
export default withRouter(Squad)