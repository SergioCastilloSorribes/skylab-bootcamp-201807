import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class listMyTeamsAsPlayer extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        teams: [],
        refresh: ""
    }

    componentDidMount() {
        this.props.handleListMyTeamsAsPlayer()
            .then(({ teams }) => {
                this.setState({ teams })
            })
            .catch(res => console.log(res))
    }

    isTeamsIn = () => {
        if (this.state.teams.length > 0) {
            return true
        } else {
            return false
        }
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
            {this.isTeamsIn() && <h3>My teams as player</h3>}
            {this.isTeamsIn() && <ul>
                <div class="list-group">
                {this.isTeamsIn() && this.state.teams.map(team => <a href="#" class="list-group-item list-group-item-action" onClick={(e) => this.handleGoToTeam(e, team._id)}>{` ${team.name}`}</a>)}
                </div>
            </ul>}
            </div>
            <div className="col-3"></div>
            </div>
        </div>

    }

}

export default withRouter(listMyTeamsAsPlayer)