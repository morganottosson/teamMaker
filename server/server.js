let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let shuffle = require('shuffle-array')

let DEFAULT_PORT = 8080;
let port = DEFAULT_PORT;


let Hans = {player: "Hans", id: 1, rating: 1000}
let Greta = {player: "Greta", id: 2, rating: 1000}
let Karina = {player: "Karina", id: 3, rating: 1000}
let Tomas = {player: "Tomas", id: 4, rating: 1000}
let Hank = {player: "Hank", id: 5, rating: 1000}
let Jim = {player: "Jim", id: 6, rating: 1000}




app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"../public")));
app.listen(port,function(){
    console.log("Started listening on port", port)
});

app.get('/players', (req, res) => {
    let players = [Hans, Greta, Karina, Tomas, Hank, Jim];
    shuffle(players)

    let halfLength = Math.ceil(players.length / 2);

    let teamOne = players
    teamOne = teamOne.slice(0,halfLength);

    let teamTwo = players
    teamTwo = teamTwo.slice(halfLength, players.length)
    console.log("players")
    console.log(players)
    console.log("teamOne")
    console.log(teamOne)
    console.log("teamTwo")
    console.log(teamTwo)
    console.log("halflength")
    console.log(halfLength)

    let every = [players, teamOne, teamTwo];



    res.send(JSON.stringify(every));
})




