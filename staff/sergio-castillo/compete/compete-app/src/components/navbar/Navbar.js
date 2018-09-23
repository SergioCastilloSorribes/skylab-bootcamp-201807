import React, { Component } from 'react'
import { Route, withRouter, Link, Redirect, Switch } from 'react-router-dom'

class Navbar extends Component {

    render() {
        return <header className="header">
            <nav className="header__navbar">
                <a href="#">COMPETE</a>
                    <Link to='/profile'>
                        {this.props.isLoggedIn() && <button type="submit">Profile</button>}
                    </Link>
                    <button onClick={this.props.handleLogout}>Logout</button>
            </nav>
        </header>
    }

}

export default withRouter(Navbar)