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
            .then(({ user }) => {
                this.setState({ user })
            })
    }

    handleRemovePlayer = (e) => {
        e.preventDefault()
        this.props.handleRemovePlayer(e)
    }

    render() {

        return <article className="PlayerData">
            <figure class="snip1559">
                <div class="profile-image"><img src={this.state.user.photo} alt="profile-sample2" /></div>
                <figcaption>
                    <h3>{this.state.user.dni}</h3>
                    <h3>{this.state.user.name} {this.state.user.surname}</h3>
                    <h5>{this.state.user.position}</h5>
                    <p>Gender: {this.state.user.gender}</p>
                    <p>Age: {this.state.user.age}</p>
                    <p>Height: {this.state.user.height} cm</p>
                    <p>Weight: {this.state.user.weight} kg</p>
                    <div class="icons"><a href="#"><i class="ion-social-reddit"></i></a>
                        <a href="#"> <i class="ion-social-twitter"></i></a>
                        <a href="#"> <i class="ion-social-vimeo"></i></a>
                    </div>
                </figcaption>
                <button type="submit" onClick={this.handleRemovePlayer} className="button is-primary is-fullwidth">Remove player</button>
            </figure>
        </article>
    }

}

export default withRouter(PlayerData)