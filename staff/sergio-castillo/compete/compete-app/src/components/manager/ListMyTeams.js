import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './ListMyTeams.css'
import Error from '../Error'

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
            .catch(({ message }) => {
                this.setState({ feedbacklist: message })
            })
    }

    handleRemoveTeam = (event, teamid) => {
        event.preventDefault()
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

    handleGoToTeam = (event, teamId) => {
        event.preventDefault()
        this.props.handleGoToTeam(teamId)
    }


    render() {

        return <aside className="ListMyTeams">
            <div className="ListMyTeams-title-wraper">
                <h3 className="ListMyTeams-title">My teams</h3>
            </div>
            <div className="ListMyTeams-field">
            {
                this.state.teams.map(team => 
                    <div className="ListMyTeams-input">
                        {/* <img className="ListMyTeams-input-logo" src="https://res.cloudinary.com/sergiocastillo/image/upload/v1538097623/Compete/Team_Logo.png" alt="Team Logo" /> */}
                        <a href="#" className="ListMyTeams-input-text" onClick={(event) => this.handleGoToTeam(event, team._id)}>{team.name}</a>
                        <a href="#" className="ListMyTeams-input-delete" onClick={(event)=>this.handleRemoveTeam(event,team._id)}>[x]</a>
                    </div>
                )
            }
            </div>
        </aside>
    }
}


// {this.state.teams.map(team => {
//     <div className="message-header"><a href="#" className="list-group-item list-group-item-action" onClick={(e) => this.handleGoToTeam(e, team._id)}>{team.name}</a><button className="btn btn-danger" onClick={(e)=>this.removeTeam(e,team._id)}>x</button></div>
// }

{/* <div className="ListMyTeams-input">
    <img src="https://res.cloudinary.com/sergiocastillo/image/upload/v1538097623/Compete/Team_Logo.png" alt="Team Logo" />
    <a href="#">Team</a>
    <a href="#">[x]</a>
</div>
{
    this.state.emailError &&
        <div className="Register-fieldError">{this.state.emailError}</div>
} */}

export default withRouter(ListMyTeams)