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

    handleGoToTournament = (e, tournamentId) => {
        e.preventDefault()
        this.props.handleGoToTournament(tournamentId)
    }


    render() {

        return <div className="container">
            <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
                <h3>MY TEAMS AS ORGANIZER</h3>
                {this.state.tournaments.map(tournament =><div className="message-header"><a href="#" className="list-group-item list-group-item-action" onClick={(e) => this.handleGoToTournament(e, tournament.id)}>{tournament.name}</a><button className="btn btn-danger" onClick={(e)=>this.handleRemoveTournament(e,tournament.id)}>x</button></div>
                )}
                
                </div>
                <div className="col-3"></div>
            </div>
        </div>
    }
}

export default withRouter(ListMyTournaments)