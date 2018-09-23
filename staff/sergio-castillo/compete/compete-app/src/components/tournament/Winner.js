import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'


class Winner extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        role: sessionStorage.getItem('role'),
        tournamentId: sessionStorage.getItem('tournamentId'),
        tournament: [],
        team: [],
        winner:undefined
    }

    componentDidMount() {
        this.props.winners.map(winner => {
            logic.retrieveTeam(this.state.id, this.state.token, winner)
            .then(team=> {
                this.setState({team})
            })
        })
    }

    render() {

        return<div className="container">
            <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
            <h3>CONGRATULATIONS {this.state.team.name}</h3>
            <span>{this.state.team.description}</span>
            {/* <Squad handleListPlayersFromTeam={this.handleListPlayersFromTeam} /> */}
            </div>
            <div className="col-3"></div>
            </div>
        </div>
    }
}
export default withRouter(Winner)