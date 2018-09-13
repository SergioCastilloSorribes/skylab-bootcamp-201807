import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import Feedback from './Feedback'

class Landing extends Component {

    state = {
        email: "",
        password: "",
        confirmPassword: "",
        feedbackAuth: "",
        feedbackReg: ""
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { email, password } = this.state
        logic.authenticate(email, password)
            .then(res => {
                this.props.handleLogin(res.id, res.token)
            })
            .catch(({ message }) => {
                this.setState({ feedbackAuth: message })
            })
    }

    handleRegister = (e) => {
        e.preventDefault()
        const { email, password, confirmPassword } = this.state
        if (password === confirmPassword) {
            logic.register(email, password)
                .then(() => logic.authenticate(email, password))
                .then(res => this.props.handleLogin(res.id, res.token))
                .catch(({ message }) => {
                    this.setState({ feedbackReg: message })
                })
        } else this.setState({ feedbackReg: 'The two passwords must be equals' })
    }

    render() {
        return <div>
            <form onSubmit={this.handleSubmit}>
                <input type="email" onChange={this.handleChange} name="email" placeholder="Introduce your email" />
                <input type="password" name="password" onChange={this.handleChange} placeholder="Password" />
                <button type="submit">Authenticate</button>
            </form>
            {this.state.feedbackAuth && <Feedback message={this.state.feedbackAuth} />}
            <form onSubmit={this.handleRegister}>
                <input type="email" onChange={this.handleChange} name="email" placeholder="Introduce your email" />
                <input type="password" name="password" onChange={this.handleChange} placeholder="Password" />
                <input type="password" name="confirmPassword" onChange={this.handleChange} placeholder="Confirm password" />
                <button type="submit">Create a new account</button>
            </form>
            {this.state.feedbackReg && <Feedback message={this.state.feedbackReg} />}
            <div className="container">
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6 borderBox">
                    <h4>Register</h4>
                    <form onSubmit={this.onRegisterSubmitted}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Name</label>
                            <input type="name" className="form-control" placeholder="Enter name" onChange={this.onNameChanged} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" placeholder="Enter email" onChange={this.onEmailChanged} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" placeholder="Password" onChange={this.onPasswordChanged} />
                            <small className="form-text text-muted">The password must be more than 6 characters</small>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <div className="col-3"></div>
            </div>
      </div>
        
        </div>
    }
}

export default withRouter(Landing)