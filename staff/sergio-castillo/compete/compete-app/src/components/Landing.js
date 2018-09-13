import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../logic'
import Feedback from './Feedback'
import './Landing.css';

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
            <div className="container auth">
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4 borderBox">
                        <h4 className="text-color">Authenticate</h4>
                        <form onSubmit={this.handleSubmit} >
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email</label>
                                <input type="email" name="email" className="form-control" placeholder="Enter email" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" name="password" className="form-control" placeholder="Password" onChange={this.handleChange} />
                                <small className="form-text text-muted">The password must be more than 6 characters</small>
                            </div>
                            <button type="submit" className="btn btn-primary">Authenticate</button>
                        </form>
                    </div>
                    <div className="col-4"></div>
                </div>
            </div>
           {this.state.feedbackAuth && <Feedback message={this.state.feedbackAuth} />}
            <div className="container">
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4 borderBox">
                        <h4 className="text-color">Register</h4>
                        <form onSubmit={this.handleRegister}>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email</label>
                                <input type="email" name="email" className="form-control" placeholder="Enter email" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" name="password" className="form-control" placeholder="Password" onChange={this.handleChange} />
                                <small className="form-text text-muted">The password must be more than 6 characters</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Confirm password</label>
                                <input type="password" name="confirmPassword" className="form-control" placeholder="Password" onChange={this.handleChange} />
                            </div>
                            <button type="submit" className="btn btn-primary">Create account</button>
                        </form>
                    </div>
                    <div className="col-4"></div>
                </div>
            </div>
            {this.state.feedbackReg && <Feedback message={this.state.feedbackReg} />}
        </div>
    }
}

export default withRouter(Landing)