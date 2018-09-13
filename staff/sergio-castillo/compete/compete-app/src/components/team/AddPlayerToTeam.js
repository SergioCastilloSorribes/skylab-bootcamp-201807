import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import Feedback from '../Feedback'


class AddPlayerToTeam extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        teamId: sessionStorage.getItem('teamId'),
        players: [],
        name:"",
        surname:"",
        dni:"",
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

    handleSearchPlayersByQuery = (e) => {
        e.preventDefault()
        logic.searchPlayerByQuery(this.state.id, this.state.token,undefined,undefined, this.state.dni)
        .then(players=> {
            this.setState({players})
        })
    }

    handleAddPlayerToTeam = (e, playerId) => {
        e.preventDefault()
        this.props.handleAddPlayerToTeam(playerId)
    }

    render() {
        return <div>
            {this.state.role === 'manager' && <form onSubmit={this.handleSearchPlayersByQuery}>
                <input type="text" name="dni" placeholder="Introduce dni" value={this.state.dni} onChange={this.handleChange} />
                <button type="submit">Search Player</button>
            </form>}
            {this.state.role==='manager' && <ul>
                {this.state.players.map(player => <li key={player._id}>{player.dni} {player.name} {player.surname} <a href="" onClick={(e) => this.handleAddPlayerToTeam(e, player._id)}>Add to team</a> </li>)}
            </ul>}
        </div>
    }
}
export default withRouter(AddPlayerToTeam)