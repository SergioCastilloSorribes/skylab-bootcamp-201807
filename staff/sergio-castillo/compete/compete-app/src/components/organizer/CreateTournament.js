import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Error from '../Error'
import './CreateTournament.css'

class CreateTournament extends Component {

    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        name: "",
        tournamentNameError: ""
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

        return <section className="CreateTournament">
            <div className="CreateTournament-title-wraper">
                <h3 className="CreateTournament-title">Create tournament</h3>
            </div>
            <form className="CreateTournament-form" onSubmit={this.handleSubmit}>
                <div className="CreateTournament-field">
                    <input type="text" className="CreateTournament-input" name="name" placeholder="Introduce your tournament name" id="tournamentname" onChange={this.handleChange} />
                    {
                        this.state.tournamentNameError &&
                        <div className="CreateTournament-fieldError">{this.state.tournamentNameError}</div>
                    }
                </div>
                <button type="submit" className="button is-primary is-fullwidth">Create tournament</button>
                    {
                        this.props.message && <Error message={this.props.message} />
                    }
            </form>
        </section>

    }

}

export default withRouter(CreateTournament)