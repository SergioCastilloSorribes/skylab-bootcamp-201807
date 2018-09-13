import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'

class CreateTeam extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        player: sessionStorage.getItem('manager'),
        name: "",
        description: "",
        owner: "",
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { id, token, name, description, owner } = this.state
        this.props.handleCreateTeam(id, token, name, description, owner)
    }

    render() {

        return <div className="container">
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <h3>CREATE TEAM</h3>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Name</label>
                            <input autoFocus type="string" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="name" placeholder="Introduce the name of the team" />
                        </div>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Description</label>
                            <input type="string" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="description" placeholder="Description" />
                        </div>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Owner</label>
                            <input type="string" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="owner" placeholder="Introduce the name of the owner" />
                        </div>
                        <button type="submit" className="btn btn-primary">Create team</button>
                    </form>
                </div>
                <div className="col-3"></div>
            </div>
        </div>

    }

}

export default withRouter(CreateTeam)