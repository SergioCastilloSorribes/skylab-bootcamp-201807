import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './ListMyTournaments.css'
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

    componentWillReceiveProps(){
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
                        this.setState({ refresh: "" })
                    })
            })
    }

    handleGoToTournament = (event, tournamentId) => {
        event.preventDefault()
        this.props.handleGoToTournament(tournamentId)
    }


    render() {

        return <aside className="ListMyTournaments">
            <div className="ListMyTournaments-title-wraper">
                <h3 className="ListMyTournaments-title">My tournaments</h3>
            </div>
            <div className="ListMyTournaments-field">
            {
                this.state.tournaments.map(tournament => 
                    <div className="ListMyTournaments-input">
                        <a href="#" className="ListMyTournaments-input-text" onClick={(event) => this.handleGoToTournament(event, tournament.id)}>{tournament.name}</a>
                        <a href="#" className="ListMyTournaments-input-delete" onClick={(event)=>this.handleRemoveTournament(event,tournament.id)}>[x]</a>
                    </div>
                )
            }

            </div>
        </aside>
    }
}

export default withRouter(ListMyTournaments)