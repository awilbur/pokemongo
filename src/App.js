import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import pokemon from './data/pokemon.json'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          {
            Object.keys(pokemon).forEach( function (key) {
              key;
            }
          }
        </p>
      </div>
    );
  }
}

export default App;
