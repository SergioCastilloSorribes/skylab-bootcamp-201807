import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import CreateTeam from './manager/CreateTeam'
import ListMyTeams from './manager/ListMyTeams';


class Manager extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        manager: sessionStorage.getItem('manager'),
        refresh: "",
        role:'manager'
    }

    isManagerIn = () => {
        if (this.state.manager === 'true') {
            return true
        } else {
            return false
        }
    }

    refreshPage = () => {
        sessionStorage.setItem('manager', true)
        this.setState({ player: sessionStorage.getItem('manager') })
        this.setState({ refresh: true })
    }

    handleCreateTeam = (id, token, name, description, owner) => {
        logic.createTeam(id, token, name, description, owner)
            .then(res => {
                sessionStorage.setItem('manager', true)
                this.setState({ player: sessionStorage.getItem('manager') })
                window.location.reload()
                return res
            })
    }

    handleListMyTeamsAsManager = () => {
        return logic.listMyTeamsAsManager(this.state.id, this.state.token)
    }

    handleGoToTeam = (teamId) => {
        this.props.handleGoToTeam(teamId, this.state.role)
    }

    handleRemoveTeam = (teamId) => {
        return logic.removeTeam(this.state.id, this.state.token, teamId)
    }

    render() {
        return <div>
            <h1>Team</h1>
            {<CreateTeam handleCreateTeam={this.handleCreateTeam} refreshPage={this.refreshPage} />}
            {this.isManagerIn() && <ListMyTeams handleListMyTeamsAsManager={this.handleListMyTeamsAsManager} handleRemoveTeam={this.handleRemoveTeam} handleGoToTeam={this.handleGoToTeam}/>}
        </div>
    }
}

export default withRouter(Manager)