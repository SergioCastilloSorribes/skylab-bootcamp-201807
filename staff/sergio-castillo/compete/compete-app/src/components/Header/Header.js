import React, { Component } from 'react'
import { Route, withRouter, Link, Redirect, Switch } from 'react-router-dom'
import './Header.css'

class Header extends Component {

    render() {
        return <header className="header">
                <div className="header__container">
                    <a href="#" className="header__title">COMPETE</a>
                    <ul className="nav-account">
                        <li className="nav-account__item open-hide"><a href="#">Language: <span className="highlight">EN</span></a>
                            {/* <ul className="main-nav__sub">
                                <li><a href="#">English</a></li>
                                <li><a href="#">Spanish</a></li>
                                <li><a href="#">French</a></li>
                                <li><a href="#">German</a></li>
                            </ul> */}
                        </li>
                        <Link to='/profile'>
                            <li className="nav-account__item"><a href="#">Profile</a></li>
                        </Link>
                        <li className="nav-account__item nav-account__item--logout"><a href="#" onClick={this.props.handleLogout}>Logout</a></li>
                    </ul>
                </div>
        </header>
    }
}

export default withRouter(Header)