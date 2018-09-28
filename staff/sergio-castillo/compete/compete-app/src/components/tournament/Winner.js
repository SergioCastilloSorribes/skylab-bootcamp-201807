import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import './Winner.css'


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

        return<aside className="Winner">
            <div className="Matches-title-wraper">
                <span className="congrats">CONGRATULATIONS</span>
                <h3 className="Matches-title color">{this.state.team.name}</h3>
            </div>
            <span>{this.state.team.description}</span>
            {/* <Squad handleListPlayersFromTeam={this.handleListPlayersFromTeam} /> */}
        </aside>
    }
}
export default withRouter(Winner)