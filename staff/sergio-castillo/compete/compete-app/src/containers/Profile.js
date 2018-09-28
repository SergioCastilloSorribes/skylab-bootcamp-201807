import React, { Component } from 'react'
import { Route, withRouter, Link, Redirect, Switch } from 'react-router-dom'
import ProfilePanel from '../components/ProfilePanel'
import RemoveUser from '../components/RemoveUser'
import logic from '../logic'

// Funciona pero hay que arreglar cosas de errores y tal.

class Profile extends Component {

    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        removeError: '',
        updateError: '',
        passwordUpdated:''
    }

    /** This is the function to update the user password */
    handleUpdatePassword = (password, newPassword) => {
        logic.updateProfile(this.state.id, this.state.token, password, newPassword)
            .then(({ message }) => {
                this.setState({ passwordUpdated: message })
            })
            .catch(({ message }) => this.setState({ updateError: message }))
    }

    /** This is the function to delete the user */
    handleRemoveUser = (e, password) => {
        logic.unregisterUser(this.state.id, this.state.token, password)
            .then(() => {
                this.props.handleLogout(e)
            })
            .catch(({ message }) => {
                this.setState({ removeError: message })
            })
    }

    render() {
        return <article>
            <ProfilePanel handleUpdatePassword={this.handleUpdatePassword} message={this.state.updateError} passwordUpdated={this.state.passwordUpdated}/>
            <RemoveUser handleRemoveUser={this.handleRemoveUser} message={this.state.removeError} />
        </article>
    }
}

export default withRouter(Profile)