import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'

class CreateTournament extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        name: "",
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { name } = this.state
        this.props.handleCreateTournament(name)
    }

    render() {

        return <div>
            <h1>CREATE TOURNAMENT</h1>
            <form onSubmit={this.handleSubmit}>
                <input type="string" onChange={this.handleChange} name="name" placeholder="Introduce your name" />
                <button type="submit">Create Tournament</button>
            </form>
        </div>

    }

}

export default withRouter(CreateTournament)