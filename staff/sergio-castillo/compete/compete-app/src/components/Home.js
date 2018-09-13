import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class Home extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        role: []
    }

    render() {
        return <div></div>
    }

}

export default withRouter(Home)