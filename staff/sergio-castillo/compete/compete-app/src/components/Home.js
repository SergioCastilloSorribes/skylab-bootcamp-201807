import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class Home extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        role: []
    }

    render() {
        return <div className="home">
            <img></img>
            <img></img>
            <img></img>
        </div>
    }

}

export default withRouter(Home)