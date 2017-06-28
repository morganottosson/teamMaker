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
    "width": "100%",
    "height": "100%",
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
    this.teamWon = this.teamWon.bind(this);
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

  teamWon(team) {
  console.log(team)
    return fetch(`/players?input=${team}`)
    .then(response => response.json())
    .then(response => {
      this.state.players = response[0]
      this.state.teamOne = response[1]
      this.state.teamTwo = response[2]
      this.forceUpdate();
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
      <div className="i hold everything" style={backgroundStyle}>
        <div style = {{"color": "white"}}>
        Lag 1
        </div>
        <div className="div with test style" style = {test}>
          <div className="players" style={arrayStyle}>{this.state.teamOne.map((player) => {
              return <div style = {test}>
              <div className='player'  >
                  <div key={player.id} style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "width":"95%", "height":"100%"}}>
                  {player.player} - 
                  {player.rating}
                  </div>
              </div>
              </div>
          })}
          <button onClick={() => { this.teamWon(1)}}> Vi vann </button>
          </div>
        <div style = {{"color": "white"}}>
        Lag 2
        </div>
          <div className="players" style={arrayStyle}>{this.state.teamTwo.map((player) => {
              return <div style = {test}>
              <div className='player' >
                  <div key={player.id} style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "width":"95%", "height":"100%"}}>
                  {player.player} - 
                  {player.rating}
                  </div>
              </div>
              </div>
          })}
          <button onClick={() => { this.teamWon(2)}}> Vi vann </button>
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
        <div className="players" style={arrayStyle}>{this.state.players.map((player) => {
            return <div style = {test}>
              <div className='player'  style={objectStyle}>
                  <div key={player.id} style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"100%", "height":"100%"}}>
                  {player.player}
                  </div>
                  <div  style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"100%", "height":"100%"}}>
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
