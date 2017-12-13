import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { PageHeader } from 'react-bootstrap'
import ToggleDisplay from 'react-toggle-display'
import {Collapse} from 'react-collapse'
import $ from "jquery"
import ReactDOM from 'react-dom'


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
    this.teamWon = this.teamWon.bind(this)
    this.delete = this.delete.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.savePlayer = this.savePlayer.bind(this)
    this.active = this.active.bind(this)
    this.makeTeams = this.makeTeams.bind(this)
  }

  //save the input text as it changes in state
  handleChange(event) {
    this.setState({value: event.target.value})
  }

  //toggles a player to active or not
  active(player, i) {
    this.setState({highlighted: !this.state.highlighted})
    return fetch (`/activePlayer?input=${player}`)
    .then(response =>
      response.json()
    )
    .then(response => {
      if(response !== 1) {
        this.setState({
          players: response[0],
          teamOne: response[1],
          teamTwo: response[2]
        })
      } else {
          alert(
            'Kunde inte skapa jämna lag, lägg till eller tabort spelare för att åtgärda detta fel'
          )
      }
    })
  }

  //removes a player
  delete(player) {
    return fetch (`/deletePlayer?input=${player}`)
    .then(response =>
      response.json()
    )
    .then(response => {
      this.setState({ players: response})
    })
  }

  //saves a player
  savePlayer() {
    let value = this.state.value
    return fetch(`/savePlayer?input=${value}`)
    .then(response =>
      response.json())
    .then(response => {
      this.setState({ players: response})
    })
  }

  //creates new teams
  makeTeams() {
    return fetch(`/makeTeams`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        teamOne: response[0],
        teamTwo: response[1]
      })
    })
  }

  //tells the servers that one or the other team won
  teamWon(team) {
    return fetch(`/teamWon?input=${team}`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        players: response[0],
        teamOne: response[1],
        teamTwo: response[2]
      })
    })
  }

  //gets all the players and teams
  fetchPlayers() {
    fetch(`/players`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        players: response[0],
        teamOne: response[1],
        teamTwo: response[2]
      })
    })
  }

  componentDidMount() {
    this.fetchPlayers()
  }

  render() {
    return (
      <div>
      <div className="mainContainer" style={backgroundStyle}>
        <div className="teams">
          <div className="teamOne">
            <div className="teamOneHeader" style = {teamHeader}>Lag 1</div>
            <div className="players" style={arrayStyle}>{this.state.teamOne.map((player) => {
                return <div key={player.id} style = {test}>
                <div className='player'>
                    <div style = {teamRowStyling}>
                    {player.player} - 
                    {player.rating}
                    </div>
                </div>
                </div>
            })}
            <button style={weWonStyle} onClick={() => { this.teamWon(1)}}> Vi vann </button>
            </div>
          </div>

        <div className="teamTwo">
          <div className="teamTwoHeader" style = {teamHeader}>
          Lag 2
          </div>
            <div className="players" style={arrayStyle}>{this.state.teamTwo.map((player) => {
                return <div key={player.id} style = {test}>
                <div className='player' >
                    <div style = {teamRowStyling}>
                    {player.player} - 
                    {player.rating}
                    </div>
                </div>
                </div>
            })}
            <button style={weWonStyle} onClick={() => { this.teamWon(2)}}> Vi vann </button>
            </div>
          </div>
        </div>

        <div className="playersHeader" style = {playersHeaderStyle}>
          <br/>Spelare 
        </div>
        
        <div>
          <input
            style= {input}
            type="text"
            value={this.state.value} 
            onChange={this.handleChange}
            placeholder="Fyll i namn"
          />
        </div>

        <button style = {buttonSaveMake}
          onClick={this.savePlayer}>
          Spara spelare
        </button>

        <button style = {buttonSaveMake}
        onClick={this.makeTeams}>
        Skapa lag
      </button>

        <div className="players" style={arrayStyle}>{this.state.players.sort((a,b) => a.player > b.player).map((player, i) => {
            return <div className="playerRow" key={player.id} style = {test}>
              <div className='player' style={objectStyle} onClick={() => { this.active(player.player, i)}}>
                  <div className="playerName"  style = {playerNameStyle}>
                  {player.player}
                  </div>
                  <div className="playerRating" style = {playerRatingStyle}>
                  {player.rating}
                  </div>
                  <div className="present" style = {present}>
                  {player.present}
                  </div>
                  <div>
                    <button style= {xbuttonStyle} onClick={() => { this.delete(player.player)}}> X </button>
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

const xbuttonStyle = {
  "fontSize": "10px", 
  "backgroundColor": "lightBlue"
}

const present = {
  "border": "1px solid black", 
  "backgroundColor": "white", 
  "padding": "5px", 
  "marginLeft": "1%", 
  "width":"20%", 
  "height":"100%"
}

const playerRatingStyle = {
  "border": "1px solid black", 
  "backgroundColor": "white", 
  "padding": "5px", 
  "marginLeft": "1%", 
  "width":"20%", 
  "height":"100%"
}

const playerNameStyle = {
  "border": "1px solid black",
  "backgroundColor": "white", 
  "padding": "5px", 
  "marginLeft": "1%", 
  "width":"60%", 
  "height":"100%"
}

const playersHeaderStyle = {
  "color": "white",
  "fontSize": "30px",
  "marginLeft": "5px"
}

const teamHeader = {
  "color": "white",
  "fontSize": "30px",
  "marginLeft": "5px"
}

const teamRowStyling = {
  "border": "1px solid black",
  "backgroundColor": "white",
  "padding": "5px",
  "width":"365px",
  "height":"100%",
  "marginLeft": "5px"
}

const weWonStyle = {
  "backgroundColor": "lightBlue",
  "fontSize": "18px",
  "marginLeft": "5px"
}

const input = {
  "fontSize": "20px",
  "marginLeft": "5px"
}

const buttonSaveMake = {
  "fontSize": "18px",
  "margin": "5px",
  "backgroundColor": "lightBlue"
}

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
    "width": "400px",
    "color": "black",
    "height": "100%",
    "flexDirection": "row" 
}