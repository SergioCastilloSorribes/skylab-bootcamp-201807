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
        matchData: [],
        feedback: undefined,
        goalsTeam1: undefined,
        goalsTeam2: undefined,
        res: []
    }

    // componentDidMount() {
    //     this.props.handleListMatches()
    //         .then(({ matchData }) => {
    //             this.setState({ matchData })
    //         })
    //         .catch(({ message }) => {
    //             this.setState({ feedback: message })
    //         })
    // }

    // componentWillReceiveProps() {
    //     this.props.handleListMatches()
    //         .then(({ matchData }) => {
    //             this.setState({ matchData })
    //         })
    //         .catch(({message})=> {
    //             this.setState({feedback:message})
    //         })
    // }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleAddResult(e, matchId) {
        e.preventDefault()
        this.props.handleAddResult(matchId, this.state.goalsTeam1, this.state.goalsTeam2)
    }

    render() {

        return <div className="container">
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <h3>MATCHES: ROUND</h3>
                    {this.props.matches && this.props.matches.length > 0 && this.props.matches.map(match => 
                        <div className="message-header">
                            <a href="#" className="list-group-item list-group-item-action">{match.team1name} {match.goalsTeam1} - {match.goalsTeam2}{match.team2name}</a>
                            {!match.goalsTeam1 && <form>
                                <input type="number" name="goalsTeam1" className="form-control" placeholder="Goals team 1" onChange={this.handleChange} />
                                <input type="number" name="goalsTeam2" className="form-control" placeholder="Goals team 2" onChange={this.handleChange} />
                            {!match.goalsTeam1 && <button className="btn btn-primary" onClick={(e) => this.handleAddResult(e, match.matchId)}>Add</button>}
                            </form>}
                        </div>
                    )}

                </div>
                <div className="col-3"></div>
            </div>
        </div>
    }
}
export default withRouter(Matches)