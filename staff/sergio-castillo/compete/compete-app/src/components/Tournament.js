import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import TeamsList from './tournament/TeamsList'
import AddTeamToTournament from './tournament/AddTeamToTournament'
import Winner from './tournament/Winner'
import logic from '../logic'
import Error from './Error'
import Matches from './tournament/Matches'
import './Tournament.css'


class Tournament extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        tournamentId: sessionStorage.getItem('tournamentId'),
        role: sessionStorage.getItem('role'),
        tournament: [],
        teams: [],
        matches: [],
        winners: [],
        feedback: undefined,
        res: [],
        result: [],
        feedback2: undefined
    }

    componentDidMount() {
        this.props.handleRetrieveTournament()
            .then(tournament => {
                this.setState({ tournament })
            })
            .catch(({ message }) => {
                this.setState({ feedback: message })
            })
    }

    handleListTeamsFromTournament = () => {
        return this.props.handleListTeamsFromTournament()
            .then(teams => {
                this.setState({ teams })
                return teams
            })
            .catch(({ message }) => {
                this.setState({ feedback: message })
            })
    }

    handleAddTeamToTournament = (teamId) => {
        logic.addTeamToTournament(this.state.id, this.state.token, this.state.tournamentId, teamId)
            .then(res => {
                this.setState({ res })
                this.handleListTeamsFromTournament()
                return true
            })
            .catch(({ message }) => {
                this.setState({ feedback: message })
            })
    }

    handleStartTournament = () => {
        logic.startTournament(this.state.id, this.state.token, this.state.tournamentId)
            .then(res => {
                this.props.handleRetrieveTournament()
                    .then(tournament => {
                        this.setState({ tournament })
                    })
                    .catch(({ message }) => {
                        this.setState({ feedback: message })
                    })
            })
    }

    handleCreateNewRound = () => {
        debugger
        logic.createNewRound(this.state.id, this.state.token, this.state.tournamentId)
            .then(() => {
                debugger
                this.props.handleRetrieveTournament()
                    .then(tournament => {
                        debugger
                        this.setState({ tournament }, () => {
                            this.handleListMatches()
                        })
                    })
                    .catch(({ message }) => {
                        console.log(message)
                    })
            })
    }

    handleListMatches = () => {
        return logic.listMatches(this.state.id, this.state.token, this.state.tournamentId)
            .then(({ matchData }) => {
                this.setState({ matches: matchData })
            })
    }

    handleAddResult = (matchId, goalsFirstTeam, goalsSecondTeam) => {
        let goal1 = parseInt(goalsFirstTeam)
        let goal2 = parseInt(goalsSecondTeam)
        logic.addResult(this.state.id, this.state.token, this.state.tournamentId, matchId, goal1, goal2)
            .then(result => {
                this.setState({ result }, () => {
                    this.props.handleRetrieveTournament()
                        .then(tournament => {
                            debugger
                            this.setState({ tournament }, () => {
                                this.handleListMatches()
                            })
                        })
                        .catch(({ message }) => {
                            this.setState({ feedback: message })
                        })
                })

                return true
            })
    }

    render() {
        return <article className="Tournament-container">
            <div className="Tournament-title">
            <h3>{this.state.tournament.nameTournament}</h3>
            </div>
            <div>
            <p>State: {this.state.tournament.state}</p>
            {this.state.tournament.state === 'creating' && <button className="Tournament-button" type="submit" onClick={this.handleStartTournament}>Start Tournament</button>}
            {this.state.tournament.state === 'playing' && this.state.tournament.roundMatches === 0 && <button className="newRound is-primary is-fullwidth" style={{width:'20%'}}  type="submit" onClick={this.handleCreateNewRound}>Create New Round</button>}
            </div>
            <div className="Tournament">
            {this.state.tournament.state === 'creating' && <AddTeamToTournament handleAddTeamToTournament={this.handleAddTeamToTournament} />}
            {this.state.tournament.state === 'creating' && <TeamsList handleListTeamsFromTournament={this.handleListTeamsFromTournament} />}
            {this.state.tournament.state === 'playing' && <Matches handleListMatches={this.handleListMatches} matches={this.state.matches} handleAddResult={this.handleAddResult} />}
            {this.state.tournament.state === 'finish' && <Winner winners={this.state.tournament.winners} />}
            {this.state.feedback && <Error message={this.state.feedback} />}
            </div>
        </article>
    }
}
export default withRouter(Tournament)