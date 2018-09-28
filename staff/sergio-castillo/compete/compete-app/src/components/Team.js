import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Squad from './team/Squad'
import AddPlayerToTeam from './team/AddPlayerToTeam'
import logic from '../logic'
import './Team.css'
import Error from './Error'


class Team extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('player'),
        manager: sessionStorage.getItem('manager'),
        organizer: sessionStorage.getItem('organizer'),
        role: sessionStorage.getItem('role'),
        teamId: sessionStorage.getItem('teamId'),
        feedbackretrieve:undefined,
        team: [],
        players:[],
        res:[],
        listPlayersError: '',
        addPlayerToTeamError: ''
    }

    componentDidMount() {
        this.props.handleRetrieveTeam()
            .then(team => {
                this.setState({ team })
            })
            .catch(({message}) => this.setState({feedbackretrieve: message}))
    }

    handleListPlayersFromTeam = () => {
        return logic.listPlayersFromTeam(this.state.id, this.state.token, this.state.teamId)
            .then(players => {
                this.setState({players})
                return players
            })
            .catch(({message})=> this.setState({listPlayersError: message}))
    }

    handleAddPlayerToTeam = ( playerId) => {
        logic.addPlayerToTeam(this.state.id, this.state.token, this.state.teamId, playerId)
            .then(res=> {
                this.setState({res})
                this.handleListPlayersFromTeam()
                return true
            })
            .catch(({message})=> this.setState({addPlayerToTeamError: message}))
    }

    render() {

       return <article className="Team-container">
            <div className="Team-title">
            <h3>{this.state.team.name}</h3>
            <span>{this.state.team.description}</span>
            </div>
            <div className="Team">
                <AddPlayerToTeam handleAddPlayerToTeam={this.handleAddPlayerToTeam}/>
                <Squad handleListPlayersFromTeam={this.handleListPlayersFromTeam} />
                {this.state.addPlayerToTeamError && <Error message={this.state.addPlayerToTeamError}/>}
                {this.state.listPlayersError && <Error message={this.state.listPlayersError}/>}

            </div>
        </article>
    }
}
export default withRouter(Team)