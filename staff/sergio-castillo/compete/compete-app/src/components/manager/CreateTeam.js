import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import logic from '../../logic'

class CreateTeam extends Component{


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('manager'),
        name: "",
        description: "",
        owner: "",
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const {id, token, name, description, owner} = this.state
        this.props.handleCreateTeam(id, token, name, description, owner)
    }

    render() {

        return <div>
            <h1>CREATE TEAM</h1>
            <form onSubmit={this.handleSubmit}>
                <input type="string" onChange={this.handleChange} name="name" placeholder="Introduce your name" />
                <input type="string" onChange={this.handleChange} name="description" placeholder="Introduce your description" />
                <input type="string" onChange={this.handleChange} name="owner" placeholder="Introduce your owner" />
                <button type="submit">Create Team</button>
            </form>
        </div>

    }

}

export default withRouter(CreateTeam)