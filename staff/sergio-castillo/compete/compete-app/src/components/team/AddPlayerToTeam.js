import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import './AddPlayerToTeam.css'
import Error from '../Error'


class AddPlayerToTeam extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        teamId: sessionStorage.getItem('teamId'),
        players: [],
        name: "",
        surname: "",
        dni: "",
        role: "",
        searchPlayersError: ''
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
        logic.searchPlayerByQuery(this.state.id, this.state.token, undefined, undefined, this.state.dni)
            .then(players => {
                this.setState({ players })
            })
            .catch(({ message }) => this.setState({ searchPlayersError: message }))
    }

    handleAddPlayerToTeam = (e, playerId) => {
        e.preventDefault()
        this.props.handleAddPlayerToTeam(playerId)
    }

    render() {

        return <aside className="AddPlayerToTeam">
            <div className="AddPlayerToTeam-title-wraper">
                <h3 className="AddPlayerToTeam-title">Players</h3>
            </div>
            <div className="AddPlayerToTeam-field">
                {this.state.role === 'manager' && <form onSubmit={this.handleSearchPlayersByQuery}>
                    <input className="form-control" type="text" name="dni" placeholder="Introduce dni or empty for all" value={this.state.dni} onChange={this.handleChange} />
                    <button className="listallplayers  is-primary is-fullwidt" type="submit">Search by dni</button>
                    {/* <button className="btn btn-primary" type="submit">List all players</button> */}
                </form>}
                {this.state.role === 'manager' && <div>
                    {
                        this.state.players.map(player =>
                            <div className="ListMyTeams-input">
                                <a href="#" className="ListMyTeams-input-text" onClick={(event) => this.handleAddPlayerToTeam(event, player._id)}>{player.dni}   /   {player.name} {player.surname}</a>
                            </div>
                        )
                    }            </div>}

            </div>
            {this.state.searchPlayersError && <Error message={this.state.searchPlayersError} />}
        </aside>
    }
}
export default withRouter(AddPlayerToTeam)