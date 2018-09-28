import React, { Component } from 'react'
import { Route, withRouter, Link, Redirect, Switch } from 'react-router-dom'
import './Nav.css'

class Nav extends Component {

  handlePlayer = (e) => {
    e.preventDefault()
    this.props.handlePlayer()
    
  }

  handleManager = (e) => {
    e.preventDefault()
    this.props.handleManager()
  }

  handleOrganizer = (e) => {
    e.preventDefault()
    this.props.handleOrganizer()
  }

  render() {
    return <nav className="Nav">
    <button type="submit" onClick={this.handlePlayer} className="Nav-button">Player</button>
    <button type="submit" onClick={this.handleManager} className="Nav-button">Manager</button>
    <button type="submit" onClick={this.handleOrganizer} className="Nav-button">Organizer</button>
  </nav>
  }

}

export default withRouter(Nav)