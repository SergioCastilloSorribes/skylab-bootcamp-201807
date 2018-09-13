import React, { Component } from 'react'
import { Route, withRouter, Link, Redirect, Switch } from 'react-router-dom'
import './nav.css'

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
    return <div class="tabs is-centered">
    <ul>
      <li class="is-active">
        <a href="#" onClick={this.handlePlayer}>
          <span class="icon is-small"><i class="far fa-futbol" aria-hidden="true"></i></span>
          <span>Player</span>
        </a>
      </li>
      <li>
        <a href="#" onClick={this.handleManager}>
          <span class="icon is-small"><i class="fas fa-chalkboard-teacher" aria-hidden="true"></i></span>
          <span>Manager</span>
        </a>
      </li>
      <li>
        <a href="#" onClick={this.handleOrganizer}>
          <span class="icon is-small"><i class="fab fa-megaport" aria-hidden="true"></i></span>
          <span>Organizer</span>
        </a>
      </li>
    </ul>
  </div>
  }

}

export default withRouter(Nav)