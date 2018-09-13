import React, { Component } from 'react';
import { Route, withRouter, Link, Redirect, Switch } from 'react-router-dom'
import logic from './logic'
import Landing from './components/Landing'
import Home from './components/Home'
import Player from './components/Player'
import Manager from './components/Manager'
import Organizer from './components/Organizer'
import Tournament from './components/Tournament'
import Team from './components/Team'
import Profile from './components/Profile'
import './App.css';
import Navbar from './components/navbar/Navbar'


class App extends Component {
  state = {
    id: sessionStorage.getItem('id') || '',
    token: sessionStorage.getItem('token') || '',
    player: false,
    manager: false,
    organizer: false,
    teamId: "",
    role: ""
  }

  isLoggedIn = () => {
    return !!this.state.id
  }

  handleLogin = (id, token) => {
    this.setState({
      id,
      token
    })
    sessionStorage.setItem('id', id)
    sessionStorage.setItem('token', token)
    logic.retrieveUserRoles(this.state.id, this.state.token)
      .then(roles => {
        for (let i = 0; i < roles.roles.length; i++) {
          if (roles.roles[i] === 'player') this.setState({ player: true })
          if (roles.roles[i] === 'manager') this.setState({ manager: true })
          if (roles.roles[i] === 'organizer') this.setState({ organizer: true })
        }
        sessionStorage.setItem('player', this.state.player)
        sessionStorage.setItem('manager', this.state.manager)
        sessionStorage.setItem('organizer', this.state.organizer)
        this.props.history.push('/home')
      })
  }

  handlePlayer = () => {
    this.props.history.push('/player')
  }

  handleManager = () => {
    this.props.history.push('/manager')
  }

  handleOrganizer = () => {
    this.props.history.push('/organizer')
  }

  handleRetrieveTeam = () => {
    return logic.retrieveTeam(this.state.id, this.state.token, sessionStorage.getItem('teamId'))
  }

  handleRetrieveTournament = () => {
    return logic.retrieveTournament(this.state.id, this.state.token, sessionStorage.getItem('tournamentId'))
  }

  handleGoToTeam = (teamId, role) => {
    sessionStorage.setItem('teamId', teamId)
    sessionStorage.setItem('role', role)
    this.props.history.push('/team')
  }

  handleGoToTournament = (tournamentId, role) => {
    sessionStorage.setItem('tournamentId', tournamentId)
    sessionStorage.setItem('role', role)
    this.props.history.push('/tournament')
  }

  handleListTeamsFromTournament = () => {
    return logic.listTeamsFromTournament(this.state.id, this.state.token, sessionStorage.getItem('tournamentId'))
  }

  handleLogout = (e) => {
    e.preventDefault()
    this.setState({
      id: '',
      token: ''
    })
    sessionStorage.clear()
  }

  render() {
    return <div className="App">
      <Navbar />
      <header className="row App__header">
        <div className="col-2"></div>
        <div className="col-2 flexbox App__header__item App__header__item__left">
          <Link to="/home" onClick={this.onResetMessage}> <p className="App__header__nav__item">C</p></Link>
        </div>
        <div className="col-3">
          <p className="App__header__nav__item">Compete</p>
          <p>Organize your tournaments</p>
        </div>
        <nav className="col-3 App__header__nav">
          {this.isLoggedIn() && <ul className="App__header__nav__ul">
            <li className="App__header__item">
              <Link to="/profile"> <p className="App__header__nav__item">Profile</p></Link></li>
            <li className="App__header__item">
              <Link to="/" onClick={this.handleLogout}> <p className="App__header__nav__item">Logout</p></Link>
            </li>
          </ul>}
        </nav>
      </header>
      <div>
        {this.isLoggedIn() && <button onClick={this.handlePlayer}>Player</button>}
        {this.isLoggedIn() && <button onClick={this.handleManager}>Manager</button>}
        {this.isLoggedIn() && <button onClick={this.handleOrganizer}>Organizer</button>}
      </div>
      <Switch>
        <Route exact path="/" render={() => this.isLoggedIn() ? <Redirect to="/home" /> : <Landing handleLogin={this.handleLogin} />} />
        <Route path="/home" render={() => this.isLoggedIn() ? <Home handlePlayer={this.handlePlayer} handleManager={this.handleManager} handleTournament={this.handleTournament} /> : <Landing handleLogin={this.handleLogin} />} />
        <Route path="/profile" render={() => this.isLoggedIn() ? <Profile /> : <Landing handleLogin={this.handleLogin} />} />
        <Route path="/player" render={() => this.isLoggedIn() ? <Player player={this.state.player} handleGoToTeam={this.handleGoToTeam} /> : <Redirect to="/" />} />
        <Route path="/manager" render={() => this.isLoggedIn() ? <Manager handleGoToTeam={this.handleGoToTeam} /> : <Redirect to="/" />} />
        <Route path="/organizer" render={() => this.isLoggedIn() ? <Organizer handleGoToTournament={this.handleGoToTournament} /> : <Redirect to="/" />} />
        <Route path="/team" render={() => this.isLoggedIn() ? <Team handleRetrieveTeam={this.handleRetrieveTeam} /> : <Redirect to="/home" />} />
        <Route path="/tournament" render={() => this.isLoggedIn() ? <Tournament handleRetrieveTournament={this.handleRetrieveTournament} handleListTeamsFromTournament={this.handleListTeamsFromTournament} /> : <Redirect to="/home" />} />
      </Switch>
    </div>
  }
}

export default withRouter(App)
