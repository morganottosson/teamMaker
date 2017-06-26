let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let shuffle = require('shuffle-array')

let DEFAULT_PORT = 8080;
let port = DEFAULT_PORT;


let Morgan = {player: "Morgan", id: 1, rating: 1000}
let LH = {player: "LarsHenric", id: 2, rating: 1000}
let Anders = {player: "Anders", id: 3, rating: 1000}
let Mats = {player: "Mats", id: 4, rating: 1000}
let Joon = {player: "Joon", id: 5, rating: 1000}
let Egon = {player: "Egon", id: 6, rating: 1000}
let Mike = {player: "Mike", id: 7, rating: 1000}
let Robin = {player: "Robin", id: 8, rating: 1000}
let Gustav = {player: "Gustav", id: 9, rating: 1000}

let players = [Morgan, LH, Anders, Mats, Joon, Egon, Mike, Robin, Gustav];
let teamOne = [];
let teamTwo = [];



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../public")));
app.listen(port,function(){
    console.log("Started listening on port", port)
});

app.get('/players', (req, res) => {

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
    let newPlayer = {player: value, id: 1, rating: 1000}
    console.log(newPlayer)
    players.push(newPlayer)
    res.send(JSON.stringify(newPlayer));
})

app.get(`/teamOneWon`, (req,res) => {
    let winner = req.query.input;
    console.log(players.length)
    console.log(teamOne.length)

    /*

    for( var i=0; i < players.length; i++) {
        for( var k=0; k < teamOne.length; i++) {
            if(players[i] === teamOne[k]) {
                console.log("match")
                console.log(players[i])
                console.log(teamOne[k])
            } else {
                console.log("no match")
            }
        }
    }

    */
    console.log("teamOneWon")
    res.send(JSON.stringify(winner))
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




