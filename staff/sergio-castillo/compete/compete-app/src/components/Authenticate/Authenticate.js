import React, { Component } from 'react'
// import validator from 'validator';
import Error from '../Error'
import './Authenticate.css'
import logo from '../../logo.png'

class Authenticate extends Component {

  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { email, password } = this.state
    let isValid = true
    this.setState({
      emailError: '',
      passwordError: ''
    })

    if (email.length < 1) {
      this.setState({ emailError: `The email can't be blank` })
      isValid = false
    }

    if (password.length < 1) {
      this.setState({ passwordError: `The password can't be blank` })
      isValid = false
    }

    if (isValid) {
      this.props.handleAuthenticate(email, password)
      this.setState({
        emailError: '',
        passwordError: '',
      })
    }

  }

  componentWillUnmount(){
    this.setState({
        emailError: '',
        passwordError: ''
    })
}

  render() {
    return (
      <section className="Authenticate">
        <div className="Authenticate-logoWrapper">
          <img className="Authenticate-logo" src={logo} alt="Compete"></img>
        </div>
        <form className="Authenticate-form" onSubmit={this.handleSubmit}>
          <div className="Authenticate-field">
            <input type="email" className="Authenticate-input" name="email" id="email" placeholder="Email" onChange={this.handleChange} />
            {
              this.state.emailError &&
              <div className="Authenticate-fieldError">{this.state.emailError}</div>
            }
          </div>
          <div className="Authenticate-field">
            <input type="password" className="Authenticate-input" name="password" id="password" placeholder="Password" onChange={this.handleChange} />
            {
              this.state.passwordError &&
              <div className="Authenticate-fieldError">{this.state.passwordError}</div>
            }
          </div>
          <button type="submit" className="button is-primary is-fullwidth">Log in</button>
          {
            this.props.message && <Error message={this.props.message} />
          }
        </form>
      </section>
    )
  }
}

export default Authenticate