import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class AddPlayer extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        dni: "",
        name: "",
        surname: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        position: "",
        squadnumber: "",
        photo: ""
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let { dni, name, surname, age, gender, height, weight, position, squadnumber, photo } = this.state
        age = parseInt(age)
        height = parseInt(height)
        weight = parseInt(weight)
        squadnumber = parseInt(squadnumber)
        this.props.handleAddPlayer(dni, name, surname, age, gender, height, weight, position, squadnumber, photo)
    }

    render() {
        return <div>
            <h1>ADD PLAYER</h1>
            <form onSubmit={this.handleSubmit}>
                <input type="string" onChange={this.handleChange} name="dni" placeholder="Introduce your dni" />
                <input type="string" onChange={this.handleChange} name="name" placeholder="Introduce your name" />
                <input type="string" onChange={this.handleChange} name="surname" placeholder="Introduce your surname" />
                <input type="number" onChange={this.handleChange} name="age" placeholder="Introduce your age" />
                <input type="radio" onChange={this.handleChange} name="gender" value="male" /><p>Male</p>
                <input type="radio" onChange={this.handleChange} name="gender" value="female" /><p>Female</p>
                <input type="radio" onChange={this.handleChange} name="gender" value="other" /> <p>Other</p>
                <input type="number" onChange={this.handleChange} name="height" placeholder="Introduce your height" />
                <input type="number" onChange={this.handleChange} name="weight" placeholder="Introduce your weight" />
                <input type="string" onChange={this.handleChange} name="position" placeholder="Introduce your position" />
                <input type="number" onChange={this.handleChange} name="squadnumber" placeholder="Introduce your squad number" />
                <input type="url" onChange={this.handleChange} name="photo" placeholder="Introduce your photo url" />
                <button type="submit">Add</button>
            </form>
            <form>
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>
                <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                    <label class="form-check-label" for="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    }
}
export default withRouter(AddPlayer)