import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'

class ListMyTournaments extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        tournaments: [],
        refresh: ""
    }

    componentDidMount() {
        this.props.handleListMyTournamentsAsOrganizer()
            .then(tournaments => {
                this.setState({
                    tournaments
                })
            })

    }


    handleRemoveTournament = (e, tournamentId) => {
        e.preventDefault()
        this.props.handleRemoveTournament(tournamentId)
            .then(() => {
                this.setState({
                    refresh: ""
                })
                this.props.handleListMyTournamentsAsOrganizer()
                    .then(tournaments => {
                        this.setState({
                            tournaments
                        })
                        this.setState({refresh:""})
                    })
            })
    }

    handleGoToTournament = (e, tournamentId) => {
        e.preventDefault()
        this.props.handleGoToTournament(tournamentId)
    }


    render() {

        return <div>
            <h1>LIST MY TOURNAMENTS</h1>
            {this.state.tournaments.map(tournament => <li key={tournament.id}> <a href="" onClick={(e) => { this.handleGoToTournament(e, tournament.id) }}>{tournament.name}</a><a href="" onClick={(e) => { this.handleRemoveTournament(e, tournament.id) }} >[x]</a> </li>)}
        </div>
    }
}

export default withRouter(ListMyTournaments)