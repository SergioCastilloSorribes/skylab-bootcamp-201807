import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchPanel from './components/SearchPanel';
import ResultList from './components/ResultList';
import logic from './logic'
logic.token = 'BQDRsEc4BtFO6jzJKm88b1Er3wV47HJ7b_ZQYXaAemPjM6UM8laACfP23K_GC5jJlb5iIOYC7C3k_uCIrV14pNjFCqSmDJZC0b0j2s0SiKWn53jxr96B5OWOmpBukKeZGIqJxJdBp3KE7w';


class App extends Component {
  state = {artists : []}
  
  onSearch = query => {
    logic.searchArtists(query)
      .then (artists => {
        this.setState({artists: artists.map(artist => {
          return {id:artist.id, text: artist.name}
        })
      })
      })
      .catch (console.error)
  }

  onArtistClick=(id) => {
    // TODO search albums form artist id
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Spotify App</h1>
        </header>
        <SearchPanel onSearch={this.onSearch}/>
        <ResultList results={this.state.artists} onItemClick={this.onArtistClick} />
      </div>
    );
  }
}

export default App;
