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
    "backgroundColor": "white",
    "position": "absolute",
    "width": "25%",
    "height": "25%",
    "zindex":1,
}

const arrayStyle = {
   "backgroundColor": "#C1D4F1",
   "margin": "auto",
   "width": "95%",
   "border": "1px solid black",
   "padding": "5px",

}

const objectStyle = {  
    "display": "flex",
    "margin": "2px",
    "padding": "2px",
    "border": "1px solid black",
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
        teamTwo: []
    }
  }

  fetchPlayers() {
    fetch(`/players`)
    .then(response => response.json())
    .then(response => {
      console.log(response)
      this.state.players = response[0]
      console.log(this.state.players)
      this.state.teamOne = response[1]
      console.log(this.state.teamOne)
      this.state.teamTwo = response[2]
      console.log(this.state.teamTwo)
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
              <div className='player' key={i} style={objectStyle}>
                  <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"100%", "height":"100%"}}>
                  {player.player}
                  </div>
              </div>
              </div>
          })}
          </div>
          Lag 2
          <div className="players" style={arrayStyle}>{this.state.teamTwo.map((player, i) => {
              return <div style = {test}>
              <div className='player' key={i} style={objectStyle}>
                  <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"100%", "height":"100%"}}>
                  {player.player}
                  </div>
              </div>
              </div>
          })}
          </div>
        </div>
        Spelare
        <div className="players" style={arrayStyle}>{this.state.players.map((player, i) => {
            return <div style = {test}>
            <div className='player' key={i} style={objectStyle}>
                <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"100%", "height":"100%"}}>
                {player.player}
                </div>
                <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"100%", "height":"100%"}}>
                {player.rating}
                </div>
            </div>
            </div>
        })}
        </div>
      </div>
    )
  }
}
