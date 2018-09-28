import React, { Component } from 'react';
import { Route, withRouter, Link, Redirect, Switch } from 'react-router-dom'
import logic from './logic'
import Landing from './containers/Landing'
import Header from './components/Header'
import Profile from './containers/Profile'
import Home from './components/Home'
import Player from './containers/Player'
import Manager from './containers/Manager'
import Organizer from './containers/Organizer'
import Tournament from './components/Tournament'
import Team from './components/Team'
import Nav from './components/Nav/Nav'

// En componente App solo debería tener las rutas y las barras de navegaciones
// Debe haber cinco componentes principales: player, manager, organizer, team y tournament.
// player debe manejar el componente de la ficha y luego manejar tres componentes: la ficha del jugador, la lista de partidos y la lista de torneos, y la ficha debe ser updateable con cualquier campo.
// manager debe manejar el crear equipo nuevo, la lista de sus equipos y la lista de sus torneos.
// organizer debe manejar el crear torneo, y la lista de sus torneos (y en un futuro la lista de instalaciones deportivas)
// team debe tener la info del equipo, la plantilla para añadir quitar jugadores con un modal q muestre su info y un campo para hacer alineaciones.
// torneo: debe tener una lista donde añadir y quitar equipos con un modal para su info, y start tournament: q debe mirar el numero de equipos y pintar el torneo ya.
// Si hay ronda previa pinta la ronda y una vez resuelta pinta el cuadro completo: segun vamos añadiendo equipos al cuadro al pintar su resultado se crea el partido.
// Es muy importante hacer como Gio -> Tener una base de datos de test y otra buena, para que la de test no te borre los datos.

class App extends Component {
  state = {
    feedbackRegister: '',
    errorRegister: '',
    errorAuthenticate: '',
    id: sessionStorage.getItem('id') || '',
    token: sessionStorage.getItem('token') || '',
    player: false,
    manager: false,
    organizer: false,
    teamId: "",
    role: "",

  }

  isLoggedIn = () => {
    return !!this.state.id
  }

  handleRegister = (email, password) => {
    return logic.register(email, password)
      .then(({ message }) => {
        this.setState({ 
          feedbackRegister: message,
          errorRegister: ''
        }) 
        return true
      })
      .catch(({ message }) => {
        this.setState({ errorRegister: message })
        return false
      })

  }

  handleAuthenticate = (email, password) => {
    logic.authenticate(email, password)
      .then(res => {
        this.setState({
          id: res.id,
          token: res.token,
          errorAuthenticate: ''
        })
        sessionStorage.setItem('id', res.id)
        sessionStorage.setItem('token', res.token)
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
      })
      .catch(({ message }) => {
        this.setState({ errorAuthenticate: message })
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
      token: '',
      player: false,
      manager: false,
      organizer: false,
    })
    sessionStorage.clear()
    this.props.history.push('/')
  }

  render() {
    return <main className="App">
      {this.isLoggedIn() && <Header isLoggedIn={this.isLoggedIn} handleLogout={this.handleLogout} />}
      {this.isLoggedIn() && <Nav handlePlayer={this.handlePlayer} handleManager={this.handleManager} handleOrganizer={this.handleOrganizer} />}
      <Switch>
        <Route exact path="/" render={() => this.isLoggedIn() ? <Redirect to="/home" /> : <Landing handleRegister={this.handleRegister} handleAuthenticate={this.handleAuthenticate} feedbackRegister={this.state.feedbackRegister} message={this.state.errorRegister} errorAuthenticate={this.state.errorAuthenticate} />} />
        <Route path="/home" render={() => this.isLoggedIn() ? <Home handlePlayer={this.handlePlayer} handleManager={this.handleManager} handleTournament={this.handleTournament} /> : <Landing handleLogin={this.handleLogin} />} />
        <Route path="/profile" render={() => this.isLoggedIn() ? <Profile handleLogout={this.handleLogout}/> : <Landing handleLogin={this.handleLogin} />} />
        <Route path="/player" render={() => this.isLoggedIn() ? <Player player={this.state.player} handleGoToTeam={this.handleGoToTeam} /> : <Redirect to="/" />} />
        <Route path="/manager" render={() => this.isLoggedIn() ? <Manager handleGoToTeam={this.handleGoToTeam} /> : <Redirect to="/" />} />
        <Route path="/organizer" render={() => this.isLoggedIn() ? <Organizer handleGoToTournament={this.handleGoToTournament} /> : <Redirect to="/" />} />
        <Route path="/team" render={() => this.isLoggedIn() ? <Team handleRetrieveTeam={this.handleRetrieveTeam} /> : <Redirect to="/home" />} />
        <Route path="/tournament" render={() => this.isLoggedIn() ? <Tournament handleRetrieveTournament={this.handleRetrieveTournament} handleListTeamsFromTournament={this.handleListTeamsFromTournament} /> : <Redirect to="/home" />} />
      </Switch>
    </main>
  }
}

export default withRouter(App)
