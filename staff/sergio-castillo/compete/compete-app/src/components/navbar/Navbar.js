import React, { Component } from 'react'
import { Route, withRouter, Link, Redirect, Switch } from 'react-router-dom'

class Navbar extends Component {

  render() {
    return <nav className="navbar navbar-dark bg-info p-3">
    
           <a href="/"className="navbar-brand text-color">COMPETE <i className="fa fa-map-marker"></i></a>
           <form className="form-inline">
               <Link to='/profile'>
                   {this.props.isLoggedIn() && <button className="btn btn-info mr-3" type="submit">Profile<i className="fa fa-plus-circle"></i></button>}
               </Link>
               {/* <Link to='/login'>
                   {this.props.isLoggedIn() && <button className="btn btn-outline-warning" type="submit">Logout <i className="fa fa-sign-in"></i></button>}
               </Link> */}
               {this.props.isLoggedIn() && <button className='btn btn-info my-2 my-sm-0' onClick={this.props.handleLogout}>Logout <i className="fa fa-sign-out"></i></button>}
           </form>
     </nav>
  }

}

export default withRouter(Navbar)