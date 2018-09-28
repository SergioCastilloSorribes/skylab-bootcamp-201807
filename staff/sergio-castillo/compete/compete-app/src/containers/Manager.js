import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import CreateTeam from '../components/Manager/CreateTeam'
import ListMyTeams from '../components/Manager/ListMyTeams'
import Error from '../components/Error'
import './styles/Manager.css'


class Manager extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        manager: sessionStorage.getItem('manager'),
        refresh: "",
        role: 'manager',
        res: [],
        createTeamError: '',
        listMyTeamsError: '',
        removeTeamError: ''
    }

    // isManagerIn = () => {
    //     if (this.state.manager === 'true') {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    handleCreateTeam = (id, token, name, description, owner) => {
        logic.createTeam(id, token, name, description, owner)
            .then(() => {
                sessionStorage.setItem('manager', true)
                this.setState({ manager: sessionStorage.getItem('manager') })
            })
            .then(() => {
                this.handleListMyTeamsAsManager()
            })
            .catch(({ message }) => {
                this.setState({ createTeamError: message })
            })
    }

    handleListMyTeamsAsManager = () => {
        return logic.listMyTeamsAsManager(this.state.id, this.state.token)
            .catch(({ message }) => {
                this.setState({ listMyTeamsError: message })
            })
    }

    handleGoToTeam = (teamId) => {
        this.props.handleGoToTeam(teamId, this.state.role)
    }

    handleRemoveTeam = (teamId) => {
        return logic.removeTeam(this.state.id, this.state.token, teamId)
            .catch(({ message }) => {
                this.setState({ removeTeamError: message })
            })
    }

    render() {
        return <article className="Manager">
            {<CreateTeam handleCreateTeam={this.handleCreateTeam} />}
            {this.state.createTeamError && <Error message={this.state.createTeamError} />}
            {this.state.manager === 'true' && <ListMyTeams handleListMyTeamsAsManager={this.handleListMyTeamsAsManager} handleRemoveTeam={this.handleRemoveTeam} handleGoToTeam={this.handleGoToTeam} />}
            {this.state.listMyTeamsError && <Error message={this.state.listMyTeamsError} />}
            {this.state.removeTeamError && <Error message={this.state.removeTeamError} />}
        </article>
    }
}

export default withRouter(Manager)