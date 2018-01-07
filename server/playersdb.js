'use strict';

var async = require('async');
var Cloudant = require('cloudant');
//Bellow is the url to the database.
//Usally you would use something like cf.env 
//to set it but since i suspect people might 
//wanto try running the app themselfs i left it in.
var cloudant = Cloudant({url: "https://e4066cf2-5f84-43fd-a096-0441201788c9-bluemix:4999cff0668ad041913175a9d8b872243c0555e797f19854db83ebdd3a0053c1@e4066cf2-5f84-43fd-a096-0441201788c9-bluemix.cloudant.com", plugin:'promises'});
var dbname = 'playersdb';
var db = null;
var doc = null;
let playersUnclean = []
let players = []
let every = []


db = cloudant.db.use(dbname);

//fetches all players
const getAllPlayers = () => {
    return new Promise((resolve,reject) => {
        db.list({include_docs:true},(err, response) => {
            if(err)
                return reject(err)
            else {
                resolve(
                    players = response
                )
            }
        })
    })
}

//saves a new player
const insertPlayer = (newPlayer => {
    return new Promise((resolve, reject) => {
        db.insert(newPlayer, (err) => {
            if(err)
                return reject(err)
            else {
                resolve()
            }
        })
    })
})

//deletes a player
const deletePlayer = ((_id) => {
    let id = _id
    return new Promise ((resolve, reject) => {
        //makes sure we have updated info for the del
        db.get(_id , (err, data) => {
            if(err)
                return reject(err)
            else {
                db.destroy(data._id, data._rev, (err) => {
                    if (err)
                        return reject(err)
                    else {
                        resolve()
                    }
                })
            }
        })
    })
})

//updates a player
const updatePlayer = ((player) => {
    let id = player._id
    return new Promise ((resolve, reject) => {
        //to make sure we have updated _rev
        db.get(id , (err, data) => {
            if(err)
                return reject(err)
            else {
                player._id = data._id
                player._rev = data._rev
                //updated the player
                db.insert(player, (err) => {
                    if(err)
                        return reject(err)
                    else {
                        resolve()
                    }
                })
            }
        })
    })
})


module.exports = {
    getAllPlayers,
    insertPlayer,
    updatePlayer,
    deletePlayer
  }

  