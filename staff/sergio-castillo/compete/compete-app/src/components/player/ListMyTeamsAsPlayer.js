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
        if (this.state.teams.length>0) {
            return true
        } else {
            return false
        }
    }

    handleGoToTeam = (e,teamId) => {
        e.preventDefault()
        this.props.handleGoToTeam(teamId)
    }

    render() {

        return <div>
            {this.isTeamsIn() && <h4>My Teams</h4>}
            {this.isTeamsIn() && <ul>
            {this.isTeamsIn() && this.state.teams.map(team => <li key={team.id}> <a href="" onClick={(e)=>this.handleGoToTeam(e,team._id)}>{` ${team.name}`}</a> </li>)}
            </ul>}
        </div>

    }

}

export default withRouter(listMyTeamsAsPlayer)