import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import CreateTeam from './manager/CreateTeam'
import ListMyTeams from './manager/ListMyTeams'
import Error from './Error'


class Manager extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        manager: sessionStorage.getItem('manager'),
        refresh: "",
        role: 'manager',
        res: [],
        feedback: undefined,
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
            .then(()=> {
                this.handleListMyTeamsAsManager()
            })
            .catch(({ message }) => {
                this.setState({feedback:message})
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
            {this.state.feedback && <Error message={this.state.feedback}/>}
            {<CreateTeam handleCreateTeam={this.handleCreateTeam} />}
            {this.state.manager==='true' && <ListMyTeams handleListMyTeamsAsManager={this.handleListMyTeamsAsManager} handleRemoveTeam={this.handleRemoveTeam} handleGoToTeam={this.handleGoToTeam} />}
        </div>
    }
}

export default withRouter(Manager)