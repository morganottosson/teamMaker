let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let shuffle = require('shuffle-array')

let DEFAULT_PORT = 8080;
let port = DEFAULT_PORT;


let Morgan = {player: "Morgan", id: 1, rating: 150, active: false, present: "Borta"}
let LH = {player: "LarsHenric", id: 2, rating: 150, active: false, present: "Borta"}
let Anders = {player: "Anders", id: 3, rating: 80, active: false, present: "Borta"}
let Mats = {player: "Mats", id: 4, rating: 80, active: false, present: "Borta"}
let Joon = {player: "Joon", id: 5, rating: 100, active: false, present: "Borta"}
let Egon = {player: "Egon", id: 6, rating: 110, active: false, present: "Borta"}
let Mike = {player: "Mike", id: 7, rating: 90, active: false, present: "Borta"}
let Robin = {player: "Robin", id: 8, rating: 120, active: false, present: "Borta"}
let Gustav = {player: "Gustav", id: 9, rating: 90, active: false, present: "Borta"}

let players = [Morgan, LH, Anders, Mats, Joon, Egon, Mike, Robin, Gustav];
let activePlayers = [];
let teamOne = [];
let teamTwo = [];
let iterations = 0;
let error = 0;
let success = 0;



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../public")));
app.listen(port,function(){
    console.log("Started listening on port", port)
});

function setRatings (team) {
    if(team == 1) {
        for(var i = 0; i < activePlayers.length; i++) {
            for(var k = 0; k < teamOne.length; k++) {
                if(players[i].player === teamOne[k].player) {
                    players[i].rating += 5;
                } 
            }
        }
    
        for(var i = 0; i < activePlayers.length; i++) {
            for(var k = 0; k < teamTwo.length; k++) {
                if(players[i].player === teamTwo[k].player) {
                    players[i].rating -= 5;
                } 
            }
        }
    } else if (team == 2) {
        for(var i = 0; i < activePlayers.length; i++) {
            for(var k = 0; k < teamOne.length; k++) {
                if(players[i].player === teamOne[k].player) {
                    players[i].rating -= 5;
                } 
            }
        }
    
        for(var i = 0; i < activePlayers.length; i++) {
            for(var k = 0; k < teamTwo.length; k++) {
                if(players[i].player === teamTwo[k].player) {
                    players[i].rating += 5;
                } 
            }
        }
    }
}

function makeTeams (activePlayers, minAcc, mostAcc) {
    if (iterations < 30) {
        shuffle(activePlayers)

        let halfLength = Math.ceil(activePlayers.length / 2);

        let ratingTeamOne = 0;
        let avgRatingTeamOne = 0;

        let ratingTeamTwo = 0;
        let avgRatingTeamTwo = 0;

        teamOne = activePlayers
        teamOne = teamOne.slice(0,halfLength);

        for(var i = 0; i < teamOne.length; i++) {
            ratingTeamOne += teamOne[i].rating
        }
        
        avgRatingTeamOne = ratingTeamOne/teamOne.length

        teamTwo = activePlayers
        teamTwo = teamTwo.slice(halfLength, activePlayers.length)

        for(var i = 0; i < teamTwo.length; i++) {
            ratingTeamTwo += teamTwo[i].rating
        }
        
        avgRatingTeamTwo = ratingTeamTwo/teamTwo.length

        howEven = avgRatingTeamOne/avgRatingTeamTwo
        if(howEven < minAcc || howEven > mostAcc) {
            console.log("not even teams")
            iterations += 1;
            console.log(iterations + " this is iterations")
            makeTeams(activePlayers,minAcc, mostAcc ); 
        }
        if(iterations < 30) {
            success = 1;
        }

        return teamOne,teamTwo, success
    }
}

function createEvenTeams (players) {
    console.log("create even teams called")
    success = 0;
    activePlayers = []
    error = 0;
    minAcc = 0;
    mostAcc = 0;
    for (var r = 0; r < players.length; r++) {
        if (players[r].active != false) {
            activePlayers.push(players[r])
        }
        
    }
    let howEven = 1;

    if (activePlayers.length > 3) {
        minAcc = 0.9;
        mostAcc = 1.1;
        makeTeams(activePlayers,minAcc, mostAcc );
    }
    if (success !== 1 && activePlayers.length > 3) {
        iterations = 0;
        minAcc = 0.8;
        mostAcc = 1.2;
        makeTeams(activePlayers,minAcc, mostAcc );
    }

    
    if(activePlayers.length > 3 && success === 0) {
        error = 1;
    }
    
    iterations = 0;
    console.log(error)
    return players, teamOne, teamTwo, error
}

app.get('/players', (req, res) => {
    let team = req.query.input;
    if(team !== undefined) {
        setRatings(team)
    }
    createEvenTeams(players)

    let every = [players, teamOne, teamTwo];

    res.send(JSON.stringify(every));
})

app.get('/savePlayer', (req,res) => {
    let value = req.query.input;
    let id = Math.random();
    let newPlayer = {player: value, id: id, rating: 100, active: false, present: "Borta"}
    players.push(newPlayer)
    res.send(JSON.stringify(newPlayer));
})


app.get('/deletePlayer', (req,res) => {
    let player = req.query.input;

    let newPlayers = players.filter(function(el) {
        return el.player !== player
    })
    players = newPlayers
    res.send(JSON.stringify(players))
})

app.get('/activePlayer', (req,res) => {
    let activePlayer = req.query.input;
    for (var i = 0; i < players.length; i++) {
        if(players[i].player === activePlayer) {
            if(players[i].active == true) {
                players[i].active = false
                players[i].present = "Borta"
            } else {
                players[i].active = true
                players[i].present = "På plats"
            }
            console.log(players[i])
        }
        
    }
    createEvenTeams(players);

    let every = [players, teamOne, teamTwo];
    if(error == 1) {
        console.log("i should return error")
        res.send(JSON.stringify(error))  
    } else {
        res.send(JSON.stringify(every));
    }
})




