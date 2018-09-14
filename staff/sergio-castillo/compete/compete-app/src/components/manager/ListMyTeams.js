import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './ListMyTeams.css'
import Feedback from '../Feedback'

class ListMyTeams extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        teams: [],
        refresh: "",
        feedbacklist: undefined
    }

    componentDidMount() {
        this.props.handleListMyTeamsAsManager()
            .then(teams => {
                this.setState({
                    teams
                })
            })
    }

    componentWillReceiveProps() {
        this.props.handleListMyTeamsAsManager()
            .then(teams => {
                this.setState({
                    teams
                })
            })
            .catch(({message})=> {
                this.setState({feedbacklist: message})
            })
    }

    removeTeam = (e,teamid) => {
        e.preventDefault()
        this.props.handleRemoveTeam(teamid)
            .then(() => {
                this.setState({
                    refresh: ""
                })
                this.props.handleListMyTeamsAsManager()
                    .then(teams => {
                        this.setState({
                            teams
                        })
                    })
            })
    }

    handleGoToTeam = (e, teamId) => {
        e.preventDefault()
        this.props.handleGoToTeam(teamId)
    }


    render() {

        return <div className="container">
            <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
                <h3>MY TEAMS AS MANAGER</h3>
                {this.state.teams.map(team =><div className="message-header"><a href="#" className="list-group-item list-group-item-action" onClick={(e) => this.handleGoToTeam(e, team._id)}>{team.name}</a><button className="btn btn-danger" onClick={(e)=>this.removeTeam(e,team._id)}>x</button></div>
                )}
                {this.state.feedbacklist && <Feedback />}
                
                </div>
                <div className="col-3"></div>
            </div>
        </div>
    }
}

export default withRouter(ListMyTeams)