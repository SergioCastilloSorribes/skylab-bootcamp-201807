import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Squad from './team/Squad'
import AddPlayerToTeam from './team/AddPlayerToTeam'
import logic from '../logic'
import Feedback from './Feedback'


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
        res:[]
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
    }

    handleAddPlayerToTeam = ( playerId) => {
        logic.addPlayerToTeam(this.state.id, this.state.token, this.state.teamId, playerId)
            .then(res=> {
                this.setState({res})
                this.handleListPlayersFromTeam()
                return true
            })
    }

    render() {

       return <div className="container">
            <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
            <h3>{this.state.team.name}</h3>
            <span>{this.state.team.description}</span>
            <AddPlayerToTeam handleAddPlayerToTeam={this.handleAddPlayerToTeam}/>
            <Squad handleListPlayersFromTeam={this.handleListPlayersFromTeam} />
            </div>
            <div className="col-3"></div>
            </div>
        </div>


        // return <div>
        //     {this.state.feedbackretrieve && <Feedback message={this.state.feedbackretrieve}/>}
        //     <h3>{this.state.team.name}</h3>
        //     {this.state.team.description}
        //     <Squad handleListPlayersFromTeam={this.handleListPlayersFromTeam} />
        //     <AddPlayerToTeam />
        // </div>
    }
}
export default withRouter(Team)