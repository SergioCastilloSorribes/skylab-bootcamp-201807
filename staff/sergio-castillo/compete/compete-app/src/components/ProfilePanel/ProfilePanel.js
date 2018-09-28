import React, { Component } from 'react'
import './ProfilePanel.css'
import Error from '../Error'

class ProfilePanel extends Component {
    state = {
        password: "",
        confirmPassword: "",
        passwordError: '',
        confirmPasswordError: '',
        newPassword:'',
        newPasswordError:'',
    }

    handleChange = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        const { password, confirmPassword, newPassword } = this.state
        let isValid = true
        this.setState({
            passwordError: '',
            confirmPasswordError: '',
            newPassword:''
        })

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

        if (newPassword.length < 1) {
            this.setState({ newPasswordError: `The new password can't be blank` })
            isValid = false
        }

        if (isValid) {
            this.props.handleUpdatePassword(password, newPassword)
            this.setState({
                passwordError: '',
                confirmPasswordError: '',
                newPassword:''
            })
        }
    }

    render() {
        return (
            <section className="ProfilePanel">
                <div className="ProfilePanel-title-wraper">
                    <h3 className="ProfilePanel-title">Change password</h3>
                </div>
                <form className="ProfilePanel-form" onSubmit={this.handleSubmit}>
                    <div className="ProfilePanel-field">
                        <input type="password" className="ProfilePanel-input" name="password" placeholder="Password" id="passwordprofile" onChange={this.handleChange} />
                        {
                            this.state.passwordError &&
                            <div className="Register-fieldError">{this.state.emailError}</div>
                        }
                    </div>
                    <div className="ProfilePanel-field">
                        <input type="password" className="ProfilePanel-input" name="confirmPassword" placeholder="Repeat Password" id="repeatpassword" onChange={this.handleChange} />
                        {
                            this.state.confirmPasswordError &&
                            <div className="ProfilePanel-fieldError">{this.state.confirmPasswordError}</div>
                        }
                    </div>
                    <div className="ProfilePanel-field">
                        <input type="password" className="ProfilePanel-input" name="newPassword" placeholder="New Password" id="newpassword" onChange={this.handleChange} />
                        {
                            this.state.newPasswordError &&
                            <div className="ProfilePanel-fieldError">{this.state.newPasswordError}</div>
                        }
                    </div>
                    <button type="submit" className="button is-primary is-fullwidth">Change Password</button>
                    {
                        this.props.message && <Error message={this.props.message} />
                    }
                    {
                        this.props.passwordUpdated && <Error message={this.props.passwordUpdated} />
                    }
                </form>
            </section>
        )
    }
}

export default ProfilePanel