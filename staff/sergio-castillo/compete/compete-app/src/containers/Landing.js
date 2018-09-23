import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Register from '../components/Register'
import Authenticate from '../components/Authenticate'
import './Landing.css';

class Landing extends Component {

    state = {
        register: false
    }

    handleRegister = (email, password) => {
        this.props.handleRegister(email, password)
            .then(() => {
                this.setState({ register: true })
            })
    }

    handleAuthenticate = (email, password) => {
        this.props.handleAuthenticate(email, password)
    }

    isRegistered = () => {
        if (this.state.register === false) {
            return true
        } else {
            return false
        }
    }

    handleGoToAuthenticate = event => {
        event.preventDefault()
        this.setState({ register: true })
    }

    handleGoToRegister = event => {
        event.preventDefault()
        this.setState({ register: false })
    }

    render() {

        return <article>
            {this.isRegistered() ? <Register handleRegister={this.handleRegister} message={this.props.message} /> :
                <Authenticate handleAuthenticate={this.handleAuthenticate} message={this.props.errorAuthenticate} />}
            {this.isRegistered() && <section className="block">
                <div className="block-message">Have an account?
                <a href="#/" className="text-link" onClick={this.handleGoToAuthenticate}>Login</a>
                </div>
            </section>}
            {!this.isRegistered() && <section className="block">
                <div className="block-message">Don't have an account?
                <a href="#/" className="text-link" onClick={this.handleGoToRegister}>Register</a>
                </div>
            </section>}
        </article>
    }
}

export default withRouter(Landing)