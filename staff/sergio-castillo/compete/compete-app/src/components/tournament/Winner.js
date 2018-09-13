import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Feedback from '../Feedback'


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
        teams: [],
        winner:[]
    }

    componentDidMount() {
        this.setState({winner: this.props.winner})
    }

    render() {
        return <div>
            <h2>WINNER</h2>
            <p>LAZY DOGS UNITED</p>
        </div>
    }
}
export default withRouter(Winner)