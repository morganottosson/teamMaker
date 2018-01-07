import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import $ from "jquery"
import Fireworks from './fireworks'


export default class RFSObjectDiv extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
        active: false,
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
    this.fireworks = this.fireworks.bind(this)
  }

  //save the input text as it changes in state
  handleChange(event) {
    this.setState({value: event.target.value})
  }

  //toggles a player to active or not
  active(player, i) {
    this.setState({highlighted: !this.state.highlighted})

    let _id = player._id
    let _rev = player._rev
    let playerActive = player.player
    let active = player.active
    let present = player.present
    let rating = player.rating
    
    return fetch (`/activePlayer?_id=${_id}&_rev=${_rev}&player=${playerActive}&active=${active}&present=${present}&rating=${rating}`)
    .then(response =>
      response.json()
    )
    .then(response => {
        this.setState({
          players: response
        })
    }) 
  }

  //removes a player
  delete(player) {
    let _id = player._id
    let _rev = player._rev

    return fetch (`/deletePlayer?_id=${_id}&_rev=${_rev}`)
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
      if(response === 1) {
        window.alert("Det är för få spelare på plats, mins 4 krävs");
      } else {
        this.setState({
          teamOne: response[0],
          teamTwo: response[1]
        })
      }
    })
  }

  //tells the servers that one or the other team won
  teamWon(team) {
    return fetch(`/teamWon?input=${team}`)
    .then(response => response.json())
    .then(response => {
      this.fireworks()
      this.setState({
        players: response[0]
      })
    })
  }

  //creates fireworks
  fireworks() {
    this.setState({
      active: true
    })  
    setTimeout(() => {
      this.setState({
        active: false
      }) 
    }, 5000);
  }

  //gets all the players and teams
  fetchPlayers() {
    fetch(`/players`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        players: response[0]
      })
    })
  }

  //gets all the players and teams
  fetchTeams() {
    fetch(`/teams`)
    .then(response => response.json())
    .then(response => {
      this.setState({
        teamOne: response[0],
        teamTwo: response[1]
      })
    })
  }

  componentDidMount() {
    this.fetchPlayers()
    this.fetchTeams()
  }

  render() {
    return (
      <div>

      <ul className="cb-slideshow">
        <li>
          <span>Image 01</span>
        </li>
        <li>
        <span>Image 02</span>
        </li>
        <li>
        <span>Image 03</span>
        </li>
        <li>
        <span>Image 04</span>
        </li>
        <li>
        <span>Image 05</span>
        </li>
        <li>
        <span>Image 06</span>
        </li>
      </ul>

      <div className="mainContainer">
        <div className="teams">
          <div className="teamOne">
            <div className="teamHeader">Lag 1</div>
            <div className="players">{this.state.teamOne.map((player, i) => {
                return <div key={i}>
                <div className='playerOnTeam'>
                    <div className="teamRow">
                    {player.player}
                    </div>
                </div>
                </div>
            })}
            </div>
            <button className="whiteButton" onClick={() => { this.teamWon(1)}}> Vi vann </button>
          </div>

        <div className="teamTwo">
          <div className="teamHeader">
          Lag 2
          </div>
            <div className="players">{this.state.teamTwo.map((player, i) => {
                return <div key={i}>
                <div className='playerOnTeam'>
                    <div className="teamRow">
                    {player.player}
                    </div>
                </div>
                </div>
            })}
            </div>
            <button className="whiteButton" onClick={() => { this.teamWon(2)}}> Vi vann </button>
          </div>
        </div>

        <button className="greenButton"
        onClick={this.makeTeams}>
        Skapa lag
        </button>

        <div className="playersHeader">
        </div>

        <div className="createPlayer">
          <div className="group">      
            <input type="text" required
            value={this.state.value} 
            onChange={this.handleChange}/>
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Spelar namn</label>
          </div>

          <button 
          className="greenButton"
            onClick={this.savePlayer}>
            Spara spelare
          </button>
        </div>

        {this.state.active && <Fireworks />}

        <div className="players">{this.state.players.sort((a,b) => a.player > b.player).map((player, i) => {
            return <div key={i} >
              <div className='player'>
                  <div className="playerName">
                  {player.player}
                  </div>
                  <div className="playerRating">
                  {player.rating}
                  </div>
                  <div className="present" onClick={() => { this.active(player, i)}}>
                  {player.present}
                  </div>
                  <div>
                    <button className ="redButton" onClick={() => { this.delete(player)}}> X </button>
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
