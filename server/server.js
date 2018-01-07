//initiate variables

let express = require('express')
let path = require('path')
let app = express()
let bodyParser = require('body-parser')
let shuffle = require('shuffle-array')
let playersdb = require('./playersdb')
let teamsdb = require('./teamsdb')
var Promise = require('promise');

let DEFAULT_PORT = 8080
let port = DEFAULT_PORT

let players = []
let activePlayers = []
let teamOne = []
let teamTwo = []
let iterations = 0
let error = 0
let success = 0


app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,"../public")))
app.listen(port,function(){
    console.log("Started listening on port", port)
})

//tries to make even teams and if it can't then it callbaks itself and retries
function makeTeams (activePlayers, minAcc, mostAcc) {

    if (iterations < 30) {
        shuffle(activePlayers)

        let halfLength = Math.ceil(activePlayers.length / 2)

        let ratingTeamOne = 0
        let avgRatingTeamOne = 0

        let ratingTeamTwo = 0
        let avgRatingTeamTwo = 0

        //creating teamOne
        teamOne = activePlayers
        teamOne = activePlayers.slice(0,halfLength)

        for(var i = 0; i < teamOne.length; i++) {
            ratingTeamOne += teamOne[i].rating
        }
        
        avgRatingTeamOne = ratingTeamOne/teamOne.length

        //creating teamTwo
        teamTwo = activePlayers
        teamTwo = teamTwo.slice(halfLength, activePlayers.length)

        for(var i = 0; i < teamTwo.length; i++) {
            ratingTeamTwo += teamTwo[i].rating
        }
        
        avgRatingTeamTwo = ratingTeamTwo/teamTwo.length

        //compares the teams ratings
        howEven = avgRatingTeamOne/avgRatingTeamTwo
        if(howEven < minAcc || howEven > mostAcc) {
            iterations += 1
            makeTeams(activePlayers,minAcc, mostAcc )
        }
        if(iterations < 30) {
            success = 1
        }

        return teamOne,teamTwo, success
    }
}

//tries to create even teams
function createEvenTeams (players) {
    success = 0
    activePlayers = []
    error = 0
    minAcc = 0
    mostAcc = 0

    //gathers the active players
    for (var r = 0; r < players.length; r++) {
        if (players[r].active != false) {
            activePlayers.push(players[r])
        }
    }
    let howEven = 1
    //if we have enough players go
    if (activePlayers.length > 3) {
        minAcc = 0.9
        mostAcc = 1.1
        makeTeams(activePlayers,minAcc, mostAcc )
    }
    //if we couldn't make even teams
    if (success !== 1 && activePlayers.length > 3) {
        iterations = 0
        minAcc = 0.8
        mostAcc = 1.2
        makeTeams(activePlayers,minAcc, mostAcc )
    }
    //will return 1 and the frontend will give error if parameters are met
    if(activePlayers.length < 3 && success === 0) {
        error = 1
        return error
    }
    
    iterations = 0

    returnObject = [teamOne, teamTwo]

    return returnObject
}

//changes ratings of players
function changeRating(players,team,amount) {
    for(var i = 0; i < players.length; i++) {
        for(var k = 0; k < team.length; k++) {
            if(players[i].player === team[k].player) {
                players[i].rating = parseInt(players[i].rating)
                players[i].rating += amount
            }
        }
    }
    return players
}

//removes unwanted data from teams database
function cleanTeams (teams) {
    let teamOneObj = teams.rows[0].doc.teamOne
    let teamTwoObj = teams.rows[0].doc.teamTwo

    teamOne = Object.keys(teamOneObj).map((k) => teamOneObj[k])
    teamTwo = Object.keys(teamTwoObj).map((k) => teamTwoObj[k])

    let every = [teamOne, teamTwo]
    return every
}

//removes unwanted data from database
function clean (players) {
    let players2 = []
    players.rows.forEach(function(player) {
        players2.push(player.doc)
    })
    players = players2
    return players
}

//gives or takes points from the players
app.get('/teamWon', (req, res) => {
    let team = req.query.input
    
    playersdb.getAllPlayers()
    .then((data) => {
        players = clean(data) 
        //gives points to team one and takes from team two
        if(team == 1) {
            players = changeRating(players, teamOne, +5)
            players = changeRating(players, teamTwo, -5)
        //gives points to team two and takes from team one    
        } else if (team == 2) {
            players = changeRating(players, teamOne, -5)
            players = changeRating(players, teamTwo, +5)
        }
        for (let i = 0; i < players.length; i++) {
            playersdb.updatePlayer(players[i])
        }
        return playersdb.getAllPlayers()
            .then((data) => {
                players = clean(data)

                let every = [players]
    
                res.send(JSON.stringify(every))
            })
    })
})

//creates new teams
app.get('/makeTeams', (req,res) => {
    //fetches the teams
    playersdb.getAllPlayers()
    .then((players) => {
        //removes unwanted data
        players = clean(players)

        let newTeams = createEvenTeams(players)

        if(newTeams === 1) {
            res.send(JSON.stringify(1))
        }

        let teamOneArr = newTeams[0]
        let teamTwoArr = newTeams[1]
        
        let teamOne = teamOneArr.reduce((player, cur, i) => {
            player[i] = cur;
            return player;
          }, {});

        let teamTwo = teamTwoArr.reduce((player, cur, i) => {
            player[i] = cur;
            return player;
        }, {});
        //updates the team       
        return teamsdb.updateTeams(teamOne, teamTwo)
        .then((data) => {
            let every = cleanTeams(data)
            res.send(JSON.stringify(every))
        })
        
    })
    .catch(err => {
        console.error(err)
        res.status(500).end()
    })
})


//fetches the players
app.get('/players', (req, res) => {
    playersdb.getAllPlayers()
    .then(players => {
        //removes unwanted data
        players = clean(players)
        let every = [players, teamOne, teamTwo]
        res.send(JSON.stringify(every))
    }) 
    .catch(err => {
        console.error(err)
        res.status(500).end()
    })
})

//fetches the teams
app.get('/teams', (req, res) => {
    teamsdb.getAllTeams()
    .then((teams) => {
        let every = cleanTeams(teams)
        res.send(JSON.stringify(every))
    })
    .catch(err => {
        console.error(err)
        res.status(500).end()
    })
})

//saves a player
app.get('/savePlayer', (req,res) => {
    let value = req.query.input
    let newPlayer = { player: value, rating: 100, active: "false", present: "Borta"}

    playersdb.insertPlayer(newPlayer)
    .then(() => {
        //returns the new updated list of players
        return playersdb.getAllPlayers()
        .then((players) => {
            players = clean(players)
            res.send(JSON.stringify(players));
        })
    })
    .catch(err => {
        console.error(err)
        res.status(500).end()
    })
})

//removes a player
app.get('/deletePlayer', (req,res) => {
    let _id = req.query._id
    
    playersdb.deletePlayer(_id)
    .then(() => {
        //returns the new list of players
        return playersdb.getAllPlayers()
        .then((players) => {
            players = clean(players)
            res.send(JSON.stringify(players));
        })
    })
})

//sets a player as active or not
app.get('/activePlayer', (req,res) => {
    let _id = req.query._id
    let _rev = req.query._rev
    let player = req.query.player
    let active = req.query.active
    let present = req.query.present
    let rating = req.query.rating

    let activePlayer = {_id, _rev, player, active, present, rating}

    if(activePlayer.active == "true") {
        activePlayer.active = false
        activePlayer.present = "Borta"
    } else {
        activePlayer.active = true
        activePlayer.present = "På plats"
    }
    //updates the player
    playersdb.updatePlayer(activePlayer)
    .then(() => {
        //gets the updated list of players
        return playersdb.getAllPlayers()
        .then((players) => {
            players = clean(players)
            res.send(JSON.stringify(players));
        })
    })
    .catch(err => {
        console.error(err)
        res.status(500).end()
    })
})



