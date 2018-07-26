import React, { Component } from 'react'

class UpdateUser extends Component{

    state = { newUsername: null, password: null, newPassword:null }

    keepnewUsername = event => this.setState({ newUsername: event.target.value })

    keepPassword = event => this.setState({ password: event.target.value })

    keepnewPassword = event => this.setState ({newPassword: event.target.value})

    onUpdate = event => {
        event.preventDefault()

        const { newUsername, password, newPassword } = this.state

        this.props.onUpdate(newUsername, password, newPassword)
    }


    render(){
        return <section>
        <form onSubmit={this.onUpdate}>
            <input type="text" placeholder="Your new username" onChange={this.keepnewUsername} />
            <input type="password" placeholder="Your password" onChange={this.keepPassword} />
            <input type="password" placeholder="Your new password" onChange={this.keepnewPassword} />
            <button>Update</button>
        </form>
        <a href="#/">Go back</a>
    </section>
        
    }
}
export default UpdateUser