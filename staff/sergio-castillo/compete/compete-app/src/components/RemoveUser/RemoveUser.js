import React, { Component } from 'react'
import Error from '../Error'
import './RemoveUser.css'

class DeleteUser extends Component {
    state = {
        password: "",
        confirmPassword: "",
        passwordError: '',
        confirmPasswordError: '',
    }

    handleChange = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { password, confirmPassword } = this.state
        let isValid = true
        this.setState({
            passwordError: '',
            confirmPasswordError: '',
        })

        if (password.length < 1) {
            this.setState({ passwordError: `The password can't be blank` })
            isValid = false
        }

        if (confirmPassword.length < 1) {
            this.setState({ confirmPasswordError: `The confirm password can't be blank` })
            isValid = false
        }

        if (password !== confirmPassword) {
            this.setState({ confirmPasswordError: 'Both passwords must be equals' })
            isValid = false
        }


        if (isValid) {
            this.props.handleRemoveUser(e, password)
            this.setState({
                passwordError: '',
                confirmPasswordError: ''
            })
        }
    }

    render() {
        return (
            <section className="RemoveUser">
                <div className="RemoveUser-title-wraper">
                    <h3 className="RemoveUser-title">Remove account</h3>
                </div>
                <form className="RemoveUser-form" onSubmit={this.handleSubmit}>
                    <div className="RemoveUser-field">
                        <input type="password" className="RemoveUser-input" name="password" placeholder="Password" id="passworddeleteuser" onChange={this.handleChange} />
                        {
                            this.state.passwordError &&
                            <div className="Register-fieldError">{this.state.emailError}</div>
                        }
                    </div>
                    <div className="RemoveUser-field">
                        <input type="password" className="RemoveUser-input" name="confirmPassword" placeholder="Repeat Password" id="confirmpassworddeleteuser" onChange={this.handleChange} />
                        {
                            this.state.confirmPasswordError &&
                            <div className="RemoveUser-fieldError">{this.state.confirmPasswordError}</div>
                        }
                    </div>
                    <button type="submit" className="button is-primary is-fullwidth">Remove Account</button>
                    {
                        this.props.message && <Error message={this.props.message} />
                    }
                </form>
            </section>
        )
    }
}

export default DeleteUser