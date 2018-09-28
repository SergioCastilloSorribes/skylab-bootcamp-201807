import React, { Component } from 'react'
import './Register.css'
import logo from '../../logo.png'
import Error from '../Error'

class Register extends Component {

    state = {

        email: "",
        password: "",
        confirmPassword: "",
        emailError: '',
        passwordError: '',
        confirmPasswordError: ''
    }

    handleChange = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        const { email, password, confirmPassword } = this.state
        let isValid = true
        this.setState({
            emailError: '',
            passwordError: '',
            confirmPasswordError: ''
        })

        if (email.length < 1) {
            this.setState({ emailError: `The email can't be blank` })
            isValid = false
        }

        if (password.length < 1) {
            this.setState({ passwordError: `The password can't be blank` })
            isValid = false
        }

        if (confirmPassword.length < 1) {
            this.setState({ confirmPasswordError: `The password can't be blank` })
            isValid = false
        }

        if (password !== confirmPassword) {
            this.setState({ confirmPasswordError: 'Both passwords must be equals' })
            isValid = false
        }

        if (isValid) {
            this.props.handleRegister(email, password)
            this.setState({
                emailError: '',
                passwordError: '',
                confirmPasswordError: ''
            })
        }
    }

    componentWillUnmount(){
        this.setState({
            emailError: '',
            passwordError: '',
            confirmPasswordError: ''
        })
    }

    render() {
        return (
            <section className="Register">
                <div className="Register-logoWrapper">
                    <img className="Register-logo" src={logo} alt="Compete"></img>
                </div>
                <form className="Register-form" onSubmit={this.handleSubmit}>
                    <div className="Register-field">
                        <input type="text" className="Register-input" name="email" placeholder="Email" id="email" onChange={this.handleChange} />
                        {
                            this.state.emailError &&
                            <div className="Register-fieldError">{this.state.emailError}</div>
                        }
                    </div>
                    <div className="Register-field">
                        <input type="password" className="Register-input" name="password" placeholder="Password" id="password" onChange={this.handleChange} />
                        {
                            this.state.passwordError &&
                            <div className="Register-fieldError">{this.state.passwordError}</div>
                        }
                    </div>
                    <div className="Register-field">
                        <input type="password" className="Register-input" name="confirmPassword" placeholder="Repeat Password" id="repeatpassword" onChange={this.handleChange} />
                        {
                            this.state.confirmPasswordError &&
                            <div className="Register-fieldError">{this.state.confirmPasswordError}</div>
                        }
                    </div>
                    <button type="submit" className="button is-primary is-fullwidth">Register</button>
                    {
                        this.props.message && <Error message={this.props.message} />
                    }
                </form>
            </section>
        )
    }
}

export default Register