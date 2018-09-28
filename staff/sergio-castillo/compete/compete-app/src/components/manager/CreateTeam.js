import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Error from '../Error'
import './CreateTeam.css'


class CreateTeam extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('manager'),
        name: "",
        teamNameError: "",
        description: "",
        descriptionError: "",
        owner: "",
        ownerError:""
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => { // Falta hacer un control de errores
        e.preventDefault()
        const { id, token, name, description, owner } = this.state
        this.props.handleCreateTeam(id, token, name, description, owner)
    }

    render() {

        return <section className="CreateTeam">
            <div className="CreateTeam-title-wraper">
                <h3 className="CreateTeam-title">Create team</h3>
            </div>
            <form className="CreateTeam-form" onSubmit={this.handleSubmit}>
                <div className="CreateTeam-field">
                    <input type="text" className="CreateTeam-input" name="name" placeholder="Introduce your team name" id="teamname" onChange={this.handleChange} />
                    {
                        this.state.teamNameError &&
                        <div className="CreateTeam-fieldError">{this.state.teamNameError}</div>
                    }
                </div>
                <div className="CreateTeam-field">
                    <input type="text" className="CreateTeam-input" name="description" placeholder="Introduce a short description" id="description" onChange={this.handleChange} />
                    {
                        this.state.descriptionError &&
                        <div className="CreateTeam-fieldError">{this.state.descriptionError}</div>
                    }
                </div>
                <div className="CreateTeam-field">
                    <input type="text" className="CreateTeam-input" name="owner" placeholder="Introduce the name of the owner" id="owner" onChange={this.handleChange} />
                    {
                        this.state.ownerError &&
                        <div className="CreateTeam-fieldError">{this.state.ownerError}</div>
                    }
                </div>

                <button type="submit" className="button is-primary is-fullwidth">Create team</button>
                <div className="CreateTeam-field">
                    {
                        this.props.message && <Error message={this.props.message} />
                    }
                </div>
            </form>
        </section>

    }

}

export default withRouter(CreateTeam)