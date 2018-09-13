import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class PlayerData extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        user: [],
        refresh: ""
    }

    componentDidMount() {
      this.props.handleRetrievePlayer()
        .then(({user})=> {
            this.setState({user})
        })
    }

    render() {

        return <div>
            <h3>Ficha del Jugador</h3>
            <ul>
                <li><img src='https://res.cloudinary.com/sergiocastillo/image/upload/v1536401305/Compete/26622.jpg' height='100px' weight='100px'/></li>
                <li>{this.state.user.dni}</li>
                <li>{this.state.user.name}</li>
                <li>{this.state.user.surname}</li>
                <li>{this.state.user.gender}</li>
                <li>{this.state.user.age}</li>
                <li>{this.state.user.height}</li>
                <li>{this.state.user.weight}</li>
                <li>{this.state.user.position}</li>
            </ul>
        </div>

    }

}

export default withRouter(PlayerData)