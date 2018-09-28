import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Error from '../Error'
import './AddPlayer.css'
import FileBase64 from "react-file-base64"
import logic from '../../logic'

class AddPlayer extends Component {


    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        dni: "",
        dniError:"",
        name: "",
        nameError: "",
        surname: "",
        surnameError: "",
        age: "",
        ageError: "",
        gender: "male",
        genderError: "",
        height: "",
        heightError: "",
        weight: "",
        weightError: "",
        position: "",
        positionError: "",
        squadnumber: "",
        squadNumberError:"",
        photo:"",
        photoError:"",
        files: "",
        loading: "true"
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

    getFiles = files => {
        this.setState({
            loading:false
        })
        this.uploadPlayerPhoto(files.base64)
    }

    uploadPlayerPhoto(photo) {
        logic.uploadPlayerPhoto(photo)
            .then(photo => {
                this.setState({
                    photo,
                    loading:true
                     })
            })
            .catch(({ message }) => {
                this.setState({ photoError: message })
            })
    }

    render() {
        return <section className="AddPlayer">
                    <div className="AddPlayer-title-wraper">
                        <h3 className="AddPlayer-title">Be a player</h3>
                    </div>
                    <form className="AddPlayer-form" onSubmit={this.handleSubmit}>
                    <div className="AddPlayer-field">
                        <input type="text" className="AddPlayer-input" name="dni" placeholder="Introduce your dni" id="dni" onChange={this.handleChange} />
                        {
                            this.state.dniError &&
                            <div className="AddPlayer-fieldError">{this.state.dniError}</div>
                        }
                    </div>
                    <div className="AddPlayer-field">
                        <input type="text" className="AddPlayer-input" name="name" placeholder="Introduce your name" id="name" onChange={this.handleChange} />
                        {
                            this.state.nameError &&
                            <div className="AddPlayer-fieldError">{this.state.nameError}</div>
                        }
                    </div>
                    <div className="AddPlayer-field">
                        <input type="text" className="AddPlayer-input" name="surname" placeholder="Introduce your surname" id="surname" onChange={this.handleChange} />
                        {
                            this.state.surnameError &&
                            <div className="AddPlayer-fieldError">{this.state.surnameError}</div>
                        }
                    </div>
                    <div className="AddPlayer-field">
                        <input type="number" className="AddPlayer-input" name="age" placeholder="Introduce your age" id="age" step='1' min='15' max='70' onChange={this.handleChange} />
                        {
                            this.state.ageError &&
                            <div className="AddPlayer-fieldError">{this.state.ageError}</div>
                        }
                    </div>
                    <div className="AddPlayer-field">
                    <select name="gender" onChange={this.handleChange} id="gender" className="AddPlayer-input">
                                <option>Choose gender</option>
                                <option>male</option>
                                <option>female</option>
                                <option>other</option>
                        </select> 
                        {/* <input type="radio" className="AddPlayer-input" name="gender" id="gendermale" value="male" onChange={this.handleChange} /><label>Male</label>
                        <input type="radio" className="AddPlayer-input" name="gender" id="genderfemale" value="female" onChange={this.handleChange} /><label>Female</label>
                        <input type="radio" className="AddPlayer-input" name="gender" id="genderother" value="other" onChange={this.handleChange} /><label>Other</label> */}
                        {
                            this.state.genderError &&
                            <div className="AddPlayer-fieldError">{this.state.genderError}</div>
                        }
                    </div>
                    <div className="AddPlayer-field">
                        <input type="number" className="AddPlayer-input" name="height" placeholder="Introduce your height" id="height" onChange={this.handleChange} />
                        {
                            this.state.heightError &&
                            <div className="AddPlayer-fieldError">{this.state.heightError}</div>
                        }
                    </div>
                    <div className="AddPlayer-field">
                        <input type="number" className="AddPlayer-input" name="weight" placeholder="Introduce your weight" id="weight" onChange={this.handleChange} />
                        {
                            this.state.weightError &&
                            <div className="AddPlayer-fieldError">{this.state.weightError}</div>
                        }
                    </div>
                    <div className="AddPlayer-field">
                        <select name="position" onChange={this.handleChange} id="position" className="AddPlayer-input">
                                <option>Choose position</option>
                                <option>Goalkeeper</option>
                                <option>Defender</option>
                                <option>Migfielder</option>
                                <option>Ataquer</option>
                        </select>                        
                        {
                            this.state.weightError &&
                            <div className="AddPlayer-fieldError">{this.state.weightError}</div>
                        }
                    </div>
                    <div className="AddPlayer-field">
                        <input type="number" className="AddPlayer-input" name="squadnumber" placeholder="Introduce your squad number" id="squadnumber" onChange={this.handleChange} />
                        {
                            this.state.squadNumberError &&
                            <div className="AddPlayer-fieldError">{this.state.squadNumberError}</div>
                        }
                    </div>
                    <div className="AddPlayer-field">
                        <FileBase64 className="input" multiple={false} onDone={this.getFiles} />    
                        {
                            this.state.photoError &&
                            <div className="AddPlayer-fieldError">{this.state.photoError}</div>
                        }
                    </div>
                    <button type="submit" className="button is-primary is-fullwidth">Add as a player</button>
                    {
                        this.props.message && <Error message={this.props.message} />
                    }
                    </form>
        </section>
    }
}
export default withRouter(AddPlayer)