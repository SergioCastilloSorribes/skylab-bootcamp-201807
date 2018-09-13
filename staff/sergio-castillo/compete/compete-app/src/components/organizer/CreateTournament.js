import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import logic from '../../logic'

class CreateTournament extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        name: "",
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { name } = this.state
        this.props.handleCreateTournament(name)
    }

    render() {

        return <div className="container">
        <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
                <h3>CREATE TOURNAMENT</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label className="text-color" for="exampleFormControlInput1">Name</label>
                        <input autoFocus type="string" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="name" placeholder="Introduce the name of the tournament" />
                    </div>
                    <button type="submit" className="btn btn-primary">Create tournament</button>
                </form>
            </div>
            <div className="col-3"></div>
        </div>
    </div>

        // return <div>
        //     <h3>CREATE TOURNAMENT</h3>
        //     <form onSubmit={this.handleSubmit}>
        //         <input type="string" onChange={this.handleChange} name="name" placeholder="Introduce your name" />
        //         <button type="submit">Create Tournament</button>
        //     </form>
        // </div>

    }

}

export default withRouter(CreateTournament)