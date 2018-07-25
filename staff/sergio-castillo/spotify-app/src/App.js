import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import logic from './logic'
import Landing from './components/Landing'
import Register from './components/Register'
import Login from './components/Login'
import GoToLogin from './components/GoToLogin'
import Main from './components/Main'
import Logout from './components/Logout'
import AlertError from './components/AlertError';

logic.spotifyToken = 'BQCX1Sgb2R-wqiZpWwL555uhHLBgSelTOkFHdGm_NgjAnltOcvXQ53ORf10EFlnH2lnOY0Ukxc7descjJ1TBCukqpHxiSaVnHs4W_gfVAASx_U38Ufcfgtv0UHXinf8HFDPRnkUaZVaw'

class App extends Component {
  state = {
    registerActive: false,
    loginActive: false,
    goToLoginActive: false,
    loggedIn: logic.loggedIn,
    errorAlert: false
  }

  goToRegister = () => this.setState({ registerActive: true })

  goToLogin = () => this.setState({ loginActive: true })

  registerUser = (username, password) =>
    logic.registerUser(username, password)
      .then(() => this.setState({ goToLoginActive: true, registerActive: false }))
      .catch((err)=> {
        this.setState({errorAlert: err.message})
        
      })

  loginUser = (username, password) =>
    logic.loginUser(username, password)
      .then(() => this.setState({ loggedIn: true, loginActive: false, errorAlert: false }))
      .catch((err)=> {
        this.setState({errorAlert: err.message})
        
      })

  goToLogin = () => {
    this.setState({ loginActive: true, goToLoginActive: false })
  }

  onLogout = () => {
    this.setState({loggedIn:false})
    logic.logout()
  }

  errorAlert = () =>{
    this.setState.errorAlert=true
  }

  render() {
    const { state: { registerActive, loginActive, goToLoginActive, loggedIn, errorAlert } } = this

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Spotify App</h1>
        </header>

        {!(registerActive || loginActive || goToLoginActive || loggedIn) && <Landing onRegister={this.goToRegister} onLogin={this.goToLogin} />}

        {registerActive && <Register onRegister={this.registerUser} />}

        {loginActive && <Login onLogin={this.loginUser} />}

        {goToLoginActive && <GoToLogin onLogin={this.goToLogin} />}

        {loggedIn && <Logout onLogout={this.onLogout}/>}
        {loggedIn && <Main />}
        
        {errorAlert && <AlertError Alert={errorAlert}/>}
      </div>
    )
  }
}

export default App
