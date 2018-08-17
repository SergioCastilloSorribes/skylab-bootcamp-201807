import React, { Component } from 'react';
import logic from '../logic'

class Profile extends Component{

  state = {
    password: "",
    newPassword: "",
    error : "",
    message: null
  }

  onPasswordChanged = e => this.setState({ password: e.target.value })

  onNewPasswordChanged = e => this.setState({ newPassword: e.target.value })

  onUpdateSubmit = (e) => {
    e.preventDefault()
    const {password,newPassword} = this.state
    const {username,token} = this.props
    logic.updateProfile(username,password,newPassword,token)
      .then(res => {
        this.setState({message:res.message})
      })
      .catch(({ message }) => alert(message))
  }



  render(){
    const {error, message} = this.state
    return <main>
    <div className="screen">
      <form onSubmit={this.onUpdateSubmit}>
        <h3>You can Update your password</h3>
        <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.onPasswordChanged} />
        <input type="password" name="newPassword" placeholder="New password" value={this.state.newPassword} onChange={this.onNewPasswordChanged} />
        <button type="submit">Update</button>
      </form>
      <p>Now you can return to your <a href="/#/files">files</a></p>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  </main>
  }
  
  
}

export default Profile