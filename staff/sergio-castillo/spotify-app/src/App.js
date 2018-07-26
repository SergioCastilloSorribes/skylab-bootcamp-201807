import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import logic from './logic'
import Landing from './components/Landing'
import Register from './components/Register'
import Login from './components/Login'
import GoToLogin from './components/GoToLogin'
import Main from './components/Main'
import UpdateUser from './components/UpdateUser';
import swal from 'sweetalert';


logic.spotifyToken = 'BQAl8S7DWlpqe4HZgbfQazhTWwypewdKrMtYGA7yDqg2deldLKYW91EhpJO3FJuSXxZLaas3p1NB81OT9WtPfKADxaouqpHKyJmB8A-MnF1McMPa5nYf5c5KqZ2D5QGT-JB3zHMcyMD7'

class App extends Component {
  state = {
    registerActive: false,
    loginActive: false,
    goToLoginActive: false,
    loggedIn: logic.loggedIn,
    errorLogin: null,
    errorRegister: null,
    main: true
  }

  goToRegister = () => this.setState({ registerActive: true, loginActive: false })

  goToLogin = () => this.setState({ loginActive: true })

  registerUser = (username, password) =>
    logic.registerUser(username, password)
      .then(() => this.setState({ goToLoginActive: true, registerActive: false }))
      .catch(({ message }) => this.setState({ errorRegister: message }))

  loginUser = (username, password) => {
    logic.loginUser(username, password)
      .then(() => this.setState({ loggedIn: true, loginActive: false }))
      .catch({ message }) => {
        this.setState({ errorLogin: message })
        swal(message)
      }
    }

  goToLogin = () => this.setState({ loginActive: true, goToLoginActive: false, error: null, registerActive: false })

  retrieveData = ()=> {
    console.log (sessionStorage.getItem('userUsername'))
  }

  showUpdatePanel= () =>{
    this.setState({main:false})
  }

  updateUser = (newUsername, password, newPassword) =>{
    
    logic.updateUser(newUsername, password, newPassword)
      .then ((res)=> {
        true
        
      })
      .catch(({ message }) => this.setState({ errorLogin: message }))
  }
  deleteUser = (password) => {
    logic.unregisterUser('123')
    logic.logout()
    this.setState({loggedIn:false, errorLogin: null})
  }
  
  logoutUser = () => {
    logic.logout()
    this.setState({ loggedIn: false })
  }


  render() {
    const { state: { registerActive, loginActive, goToLoginActive, loggedIn, errorRegister, errorLogin, main }, goToRegister, goToLogin, registerUser, loginUser, logoutUser, updateUser, retrieveData, deleteUser, showUpdatePanel } = this

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Spotify App</h1>
          <nav>
          {sessionStorage.getItem('userUsername')}
          {loggedIn && <button onClick={retrieveData}>Profile Info</button>}
          {loggedIn && <button onClick={showUpdatePanel}>Update</button>}
          {loggedIn && <button onClick={deleteUser}>Delete User</button>}
          {loggedIn && <button onClick={logoutUser}>Logout</button>}
          </nav>
        </header>

        {!(registerActive || loginActive || goToLoginActive || loggedIn) && <Landing onRegister={goToRegister} onLogin={goToLogin} />}

        {registerActive && <Register onRegister={registerUser} onGoToLogin={goToLogin} error={errorRegister} />}

        {loginActive && <Login onLogin={loginUser} onGoToRegister={goToRegister} error={errorLogin} />}

        {goToLoginActive && <GoToLogin onLogin={goToLogin} />}

        {loggedIn && main && <Main />}

        {loggedIn && !main && <UpdateUser onUpdate={updateUser}/>}
      </div>
    )
  }
}

export default App
