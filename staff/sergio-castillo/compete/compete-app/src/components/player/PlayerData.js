import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './PlayerData.css'

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
            <div className="ficha">
                <img src='https://res.cloudinary.com/sergiocastillo/image/upload/v1536401305/Compete/26622.jpg' height='100px' weight='100px'/>
                <ul>
                    <li>DNI: {this.state.user.dni}</li>
                    <li>Player: {this.state.user.name} {this.state.user.surname}</li>
                    <li>Gender: {this.state.user.gender}</li>
                    <li>Age: {this.state.user.age}</li>
                    <li>Height: {this.state.user.height} cm</li>
                    <li>Weight: {this.state.user.weight} kg</li>
                    <li>Position: {this.state.user.position}</li>
                </ul>
            </div>
        </div>

    }

}

export default withRouter(PlayerData)