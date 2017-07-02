import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { PageHeader } from 'react-bootstrap';
import ToggleDisplay from 'react-toggle-display';
import {Collapse} from 'react-collapse';
import $ from "jquery";
import ReactDOM from 'react-dom'

const collapseDiv = {
  "display": "flex"
}

const bollBild = {
  url: 'http://www8.idrottonline.se/globalassets/athletic-fc--fotboll/cropped-bg.jpg'
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
        value: '',
    },
    this.teamWon = this.teamWon.bind(this);
    this.delete = this.delete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.savePlayer = this.savePlayer.bind(this);
    this.active = this.active.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});

  }

  active(player, i) {
    this.setState({highlighted: !this.state.highlighted});
    return fetch (`/activePlayer?input=${player}`)
    .then(response =>
      response.json()
    )
    .then(response => {
      console.log(response +  " this is response lenght")
      if(response !== 1) {
      this.state.players = response[0]
      this.state.teamOne = response[1]
      this.state.teamTwo = response[2]
      } else {
        console.log(" here i should make alert ")
        alert(
          'Kunde inte skapa jämna lag, lägg till eller tabort spelare för att åtgärda detta fel'
        )
      }

      this.forceUpdate();
    })
  }

  delete(player) {
    return fetch (`/deletePlayer?input=${player}`)
    .then(response =>
      response.json()
    )
    .then(response => {
      this.fetchPlayers();
    })
  }

  savePlayer() {
    let value = this.state.value
    return fetch(`/savePlayer?input=${value}`)
    .then(response =>
      response.json())
    .then( response => {
      console.log(response)
      this.fetchPlayers();
    })
  }

  teamWon(team) {
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
      <div>
      <div className="i hold everything" style={backgroundStyle}>


        <div className="teams">
          <div className="teamOne">
            <div className="teamOneHeader" style = {{"color": "white", "fontSize": "30px"}}>
            Lag 1
            </div>

            <div className="players" style={arrayStyle}>{this.state.teamOne.map((player) => {
                return <div key={player.id} style = {test}>
                <div className='player'  >
                    <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "width":"95%", "height":"100%"}}>
                    {player.player} - 
                    {player.rating}
                    </div>
                </div>
                </div>
            })}

            <button style={{"backgroundColor": "lightBlue", "fontSize": "18px"}} onClick={() => { this.teamWon(1)}}> Vi vann </button>

            </div>
          </div>

        <div className="teamTwo">

          <div className="teamTwoHeader" style = {{"color": "white", "fontSize": "30px"}}>
          Lag 2
          </div>

            <div className="players" style={arrayStyle}>{this.state.teamTwo.map((player) => {
                return <div key={player.id} style = {test}>
                <div className='player' >
                    <div style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "width":"95%", "height":"100%"}}>
                    {player.player} - 
                    {player.rating}
                    </div>
                </div>
                </div>
            })}

            <button style={{"backgroundColor": "lightBlue", "fontSize": "18px"}} onClick={() => { this.teamWon(2)}}> Vi vann </button>

            </div>
          </div>
        </div>

        <div className="playersHeader" style = {{"color": "white", "fontSize": "30px"}}>
          <br/>Spelare 
        </div>

        <div>
          <input
            style= {{"fontSize": "20px"}}
            type="text"
            value={this.state.value} 
            onChange={this.handleChange}
            placeholder="Fyll i namn"
          />
        </div>

        <button style = {{"fontSize": "18px", "margin": "5px", "backgroundColor": "lightBlue"}}
          onClick={this.savePlayer}>
          Spara spelare
        </button>

        <div className="players" style={arrayStyle}>{this.state.players.sort((a,b) => a.player > b.player).map((player, i) => {
            return <div className="who am i" key={player.id} style = {test}>
              <div className='player' style={objectStyle} onClick={() => { this.active(player.player, i)}}>
                  <div className="playerName"  style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"60%", "height":"100%"}}>
                  {player.player}
                  </div>
                  <div className="playerRating" style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"20%", "height":"100%"}}>
                  {player.rating}
                  </div>
                  <div className="present" style = {{"border": "1px solid black", "backgroundColor": "white", "padding": "5px", "marginLeft": "1%", "width":"20%", "height":"100%"}}>
                  {player.present}
                  </div>
                  <div>
                    <button style= {{"fontSize": "10px", "backgroundColor": "lightBlue"}} onClick={() => { this.delete(player.player)}}> X </button>
                  </div>
              </div>
            </div>
        })}
        </div>
      </div>
      </div>
      
    )
  }
}
