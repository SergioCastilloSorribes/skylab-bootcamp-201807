import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'
import Feedback from '../Feedback'



class Matches extends Component {
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
        matchData: []
    }

    componentDidMount() {
        this.props.handleListMatches()
            .then(({ matchData }) => {
                this.setState({ matchData })
            })
    }

    render() {
        return <div>
            {this.state.matchData.map(match => <li key={match._id}> {match.team1name}<input type="number" onChange={this.handleChange} name="goalsTeam1" placeholder="Goals" />
                vs {match.team2name}  <input type="number" name="goalsTeam2" onChange={this.handleChange} placeholder="Goals" /></li>)}
        </div>
    }
}
export default withRouter(Matches)