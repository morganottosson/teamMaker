//creates variables

let express = require('express')
let path = require('path')
let app = express()
let bodyParser = require('body-parser')
let shuffle = require('shuffle-array')

let DEFAULT_PORT = 8080
let port = DEFAULT_PORT

let Morgan = {player: "Morgan", id: 1, rating: 100, active: false, present: "Borta"}
let LH = {player: "LarsHenric", id: 2, rating: 100, active: false, present: "Borta"}
let Anders = {player: "Anders", id: 3, rating: 100, active: false, present: "Borta"}
let Mats = {player: "Mats", id: 4, rating: 100, active: false, present: "Borta"}
let Joon = {player: "Joon", id: 5, rating: 100, active: false, present: "Borta"}
let Egon = {player: "Egon", id: 6, rating: 100, active: false, present: "Borta"}
let Mike = {player: "Mike", id: 7, rating: 100, active: false, present: "Borta"}
let Robin = {player: "Robin", id: 8, rating: 100, active: false, present: "Borta"}
let Gustav = {player: "Gustav", id: 9, rating: 100, active: false, present: "Borta"}

let players = [Morgan, LH, Anders, Mats, Joon, Egon, Mike, Robin, Gustav]
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

    if(activePlayers.length > 3 && success === 0) {
        error = 1
    }
    
    iterations = 0
    return players, teamOne, teamTwo, error
}
//gives or takes points from the players
app.get('/teamWon', (req, res) => {

    let team = req.query.input
    //gives points to team one and takes from team two
    if(team == 1) {
        
        for(var i = 0; i < players.length; i++) {
            for(var k = 0; k < teamOne.length; k++) {
                console.log(players[i].player)
                console.log(teamOne[k].player)
                if(players[i].player === teamOne[k].player) {
                    players[i].rating += 5
                    console.log(players[i].player + "+5")
                } 
            }
        }
    
        for(var i = 0; i < players.length; i++) {
            for(var k = 0; k < teamTwo.length; k++) {
                if(players[i].player === teamTwo[k].player) {
                    players[i].rating -= 5
                    console.log(players[i].player + "-5")
                } 
            }
        }
    //gives points to team two and takes from team one    
    } else if (team == 2) {
        for(var i = 0; i < players.length; i++) {
            for(var k = 0; k < teamOne.length; k++) {
                if(players[i].player === teamOne[k].player) {
                    players[i].rating -= 5
                    console.log(players[i].player + "-5")
                } 
            }
        }
    
        for(var i = 0; i < players.length; i++) {
            for(var k = 0; k < teamTwo.length; k++) {
                if(players[i].player === teamTwo[k].player) {
                    players[i].rating += 5
                    console.log(players[i].player + "+5")
                } 
            }
        }
    }
    let every = [players, teamOne, teamTwo]
    
    res.send(JSON.stringify(every))
})

//returns players and teams
app.get('/players', (req, res) => {

    let every = [players, teamOne, teamTwo]

    res.send(JSON.stringify(every))
})
//saves a player
app.get('/savePlayer', (req,res) => {
    let value = req.query.input
    let id = Math.random()
    let newPlayer = {player: value, id: id, rating: 100, active: false, present: "Borta"}
    players.push(newPlayer)
    res.send(JSON.stringify(players));
})

//removes a player
app.get('/deletePlayer', (req,res) => {
    let player = req.query.input

    let newPlayers = players.filter(function(el) {
        return el.player !== player
    })
    players = newPlayers
    res.send(JSON.stringify(players))
})
//sets a player as active or not
app.get('/activePlayer', (req,res) => {
    let activePlayer = req.query.input
    for (var i = 0; i < players.length; i++) {
        if(players[i].player === activePlayer) {
            if(players[i].active == true) {
                players[i].active = false
                players[i].present = "Borta"
            } else {
                players[i].active = true
                players[i].present = "På plats"
            }
        }
    }

    let every = [players, teamOne, teamTwo];
    if(error == 1) {
        res.send(JSON.stringify(error))  
    } else {
        res.send(JSON.stringify(every))
    }
})

//creates new teams
app.get('/makeTeams', (req,res) => {
    createEvenTeams(players)
    let every = [teamOne, teamTwo];
    res.send(JSON.stringify(every))
})




