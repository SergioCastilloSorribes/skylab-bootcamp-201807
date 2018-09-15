import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './AddPlayer.css'

class AddPlayer extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        dni: "",
        name: "",
        surname: "",
        age: "",
        gender: "male",
        height: "",
        weight: "",
        position: "",
        squadnumber: "",
        photo: "" || 'http://www.google.es'
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
        return <div className="container">
            <h3>ADD PLAYER</h3>
            <div className="row">
                <div className="col-2"></div>
                <div className="col-3">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Dni</label>
                            <input autofocus type="string" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="dni" placeholder="Introduce your dni" />
                        </div>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Name</label>
                            <input type="string" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="name" placeholder="Introduce your name" />
                        </div>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Surname</label>
                            <input type="string" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="surname" placeholder="Introduce your surname" />
                        </div>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Age</label>
                            <input type="number" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="age" placeholder="Introduce your age" />
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" onChange={this.handleChange} type="radio" name="gender" id="exampleRadios1" value="male" checked />
                            <label className="form-check-label" for="exampleRadios1">
                                Male
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" onChange={this.handleChange} type="radio" name="gender" id="exampleRadios2" value="female" />
                            <label className="form-check-label" for="exampleRadios2">
                                Female
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" onChange={this.handleChange} type="radio" name="gender" id="exampleRadios3" value="other" disabled />
                            <label className="form-check-label" for="exampleRadios3">
                                Other
                            </label>
                        </div>
                    </form>
                </div>
                <div className="col-2"></div>
                <div className="col-3">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Height</label>
                            <input type="number" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="height" placeholder="Introduce your height" />
                        </div>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Weight</label>
                            <input type="number" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="weight" placeholder="Introduce your weight" />
                        </div>
                        <div className="form-group">
                            <label for="inputState" className="text-color">Position</label>
                            <select name="position" onChange={this.handleChange} id="inputState" className="form-control">
                                <option selected>Goalkeeper</option>
                                <option>Defender</option>
                                <option>Migfielder</option>
                                <option>Ataquer</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="text-color" for="exampleFormControlInput1">Squad number</label>
                            <input type="number" onChange={this.handleChange} className="form-control" id="exampleFormControlInput1" name="squadnumber" placeholder="Introduce your squad number" />
                        </div>
                        {/* <div className="custom-file">
                            <label className="text-color" for="exampleFormControlInput1">Photo</label>
                            <input type="file" className="custom-file-input" id="customFile" />
                            <label className="custom-file-label" for="customFile">Choose file</label>
                        </div> */}
                        <button type="submit" className="btn btn-primary">Add as a player</button>
                        </form>
                </div>
                    
            <div className="col-2"></div>
        </div>
        </div >
    }
}
export default withRouter(AddPlayer)