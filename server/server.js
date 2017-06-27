let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let shuffle = require('shuffle-array')

let DEFAULT_PORT = 8080;
let port = DEFAULT_PORT;


let Morgan = {player: "Morgan", id: 1, rating: 100}
let LH = {player: "LarsHenric", id: 2, rating: 100}
let Anders = {player: "Anders", id: 3, rating: 100}
let Mats = {player: "Mats", id: 4, rating: 100}
let Joon = {player: "Joon", id: 5, rating: 100}
let Egon = {player: "Egon", id: 6, rating: 100}
let Mike = {player: "Mike", id: 7, rating: 100}
let Robin = {player: "Robin", id: 8, rating: 100}
let Gustav = {player: "Gustav", id: 9, rating: 100}

let players = [Morgan, LH, Anders, Mats, Joon, Egon, Mike, Robin, Gustav];
let teamOne = [];
let teamTwo = [];



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../public")));
app.listen(port,function(){
    console.log("Started listening on port", port)
});

function setRatings (team) {
    console.log(team)
    if(team == 1) {
        console.log("adding to team 1")
        for(var i = 0; i < players.length; i++) {
            for(var k = 0; k < teamOne.length; k++) {
                if(players[i].player === teamOne[k].player) {
                    players[i].rating += 5;
                } 
            }
        }
    
        for(var i = 0; i < players.length; i++) {
            for(var k = 0; k < teamTwo.length; k++) {
                if(players[i].player === teamTwo[k].player) {
                    players[i].rating -= 5;
                } 
            }
        }
    } else if (team == 2) {
        console.log("adding to team 2")
        for(var i = 0; i < players.length; i++) {
            for(var k = 0; k < teamOne.length; k++) {
                if(players[i].player === teamOne[k].player) {
                    players[i].rating -= 5;
                } 
            }
        }
    
        for(var i = 0; i < players.length; i++) {
            for(var k = 0; k < teamTwo.length; k++) {
                if(players[i].player === teamTwo[k].player) {
                    players[i].rating += 5;
                } 
            }
        }
    }
    console.log(players)


}

function createEvenTeams (players) {
    shuffle(players)

    let halfLength = Math.ceil(players.length / 2);

    let ratingTeamOne = 0;
    let avgRatingTeamOne = 0;

    let ratingTeamTwo = 0;
    let avgRatingTeamTwo = 0;

    teamOne = players
    teamOne = teamOne.slice(0,halfLength);

    for(var i = 0; i < teamOne.length; i++) {
        ratingTeamOne += teamOne[i].rating
    }
    
    avgRatingTeamOne = ratingTeamOne/teamOne.length
    console.log(avgRatingTeamOne)

    teamTwo = players
    teamTwo = teamTwo.slice(halfLength, players.length)

    for(var i = 0; i < teamTwo.length; i++) {
        ratingTeamTwo += teamTwo[i].rating
    }
    
    avgRatingTeamTwo = ratingTeamTwo/teamTwo.length
    console.log(avgRatingTeamTwo)


}

app.get('/players', (req, res) => {
    let team = req.query.input;
    if(team !== undefined) {
        setRatings(team)
    }
    createEvenTeams(players)
    shuffle(players)

    let halfLength = Math.ceil(players.length / 2);

    teamOne = players
    teamOne = teamOne.slice(0,halfLength);

    teamTwo = players
    teamTwo = teamTwo.slice(halfLength, players.length)

    let every = [players, teamOne, teamTwo];

    res.send(JSON.stringify(every));
})

app.get('/savePlayer', (req,res) => {
    let value = req.query.input;
    let id = Math.random();
    let newPlayer = {player: value, id: id, rating: 100}
    console.log(newPlayer)
    players.push(newPlayer)
    res.send(JSON.stringify(newPlayer));
})


app.get('/deletePlayer', (req,res) => {
    let player = req.query.input;

    let newPlayers = players.filter(function(el) {
        console.log(el.player)
        return el.player !== player
    })
    players = newPlayers
    console.log(newPlayers)
    res.send(JSON.stringify(players))
})




