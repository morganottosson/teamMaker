import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { PageHeader } from 'react-bootstrap';
import ToggleDisplay from 'react-toggle-display';
import {Collapse} from 'react-collapse';

const collapseDiv = {
  "display": "flex"
}

const test = {
  "display": "flex",
  "flexDirection": "column"
}

const backgroundStyle = {
    "position": "absolute",
    "width": "50%",
    "height": "50%",
    "zindex":1,
}

const arrayStyle = {
   "margin": "auto",
   "width": "100%",


}

const objectStyle = {  
    "display": "flex",
    "width": "99%",
    "color": "black",
    "height": "100%",
    "flexDirection": "row"
    
}

export default class RFSObjectDiv extends Component {
  constructor(props) {
    super(props)
    this.state = {
        collapse: false,
        players: [],
        teamOne: [],
        teamTwo: [],
        value: ''
    },
    this.teamOneWon = this.teamOneWon.bind(this);
    this.delete = this.delete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.savePlayer = this.savePlayer.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(this.state.value)

  }

  delete(player) {
    return fetch (`/deletePlayer?input=${player}`)
    .then(response =>
      response.json()
    )
    .then(response => {
      console.log("this is players after delete")
      console.log(this.state.players)

      this.fetchPlayers();
    })
  }

  savePlayer() {
    let value = this.state.value
    console.log("savePlayer")
    return fetch(`/savePlayer?input=${value}`)
    .then(response =>
      response.json())
    .then( response => {
      this.fetchPlayers();
    })
  }

  teamOneWon() {
    let winner = 1;

    return fetch(`/teamOneWon?input=${winner}`)
    .then(response => {
      this.fetchPlayers();
    })
  }


  fetchPlayers() {
    fetch(`/players`)
    .then(response => response.json())
    .then(response => {
      this.state.players = response[0]
      this.state.teamOne = response[1]
      this.state.teamTwo = response[2]
      this.forceUpdate();
    })
  }

  componentDidMount() {
    this.fetchPlayers();
  }

  render() {
    return (
      <div style={backgroundStyle}>
        Lag 1
        <div style = {test}>
          <div className="players" style={arrayStyle}>{this.state.teamOne.map((player, i) => {
              return <div style = {test}>
              <div className='player' key={i} >
                  <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "width":"95%", "height":"100%"}}>
                  {player.player}
                  </div>
              </div>
              </div>
          })}
          <button onClick={() => { this.teamOneWon()}}> Vi vann </button>
          </div>
          Lag 2
          <div className="players" style={arrayStyle}>{this.state.teamTwo.map((player, i) => {
              return <div style = {test}>
              <div className='player' key={i}>
                  <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "width":"95%", "height":"100%"}}>
                  {player.player}
                  </div>
              </div>
              </div>
          })}
          </div>
        </div>
        Spelare
        <div>
          <input
            type="text"
            value={this.state.value} 
            onChange={this.handleChange}
            placeholder="Fyll i namn"
          />
        </div>
        <button
          onClick={this.savePlayer}>
        Spara spelare
        </button>
        <div className="players" style={arrayStyle}>{this.state.players.map((player, i) => {
            return <div style = {test}>
              <div className='player' key={player.id} style={objectStyle}>
                  <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"100%", "height":"100%"}}>
                  {player.player}
                  </div>
                  <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"100%", "height":"100%"}}>
                  {player.rating}
                  </div>
                  <div>
                    <button onClick={() => { this.delete(player.player)}}> X </button>
                  </div>
              </div>
            </div>
        })}
        </div>
      </div>
    )
  }
}
