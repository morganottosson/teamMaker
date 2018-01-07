'use strict';

var async = require('async');
var Cloudant = require('cloudant');
//Bellow is the url to the database.
//Usally you would use something like cf.env 
//to set it but since i suspect people might 
//wanto try running the app themselfs i left it in.
var cloudant = Cloudant({url: "https://e4066cf2-5f84-43fd-a096-0441201788c9-bluemix:4999cff0668ad041913175a9d8b872243c0555e797f19854db83ebdd3a0053c1@e4066cf2-5f84-43fd-a096-0441201788c9-bluemix.cloudant.com", plugin:'promises'});
var dbname = 'teamsdb';
var db = null;
var doc = null;
let teams = null;

db = cloudant.db.use(dbname);


const getAllTeams = () => {
    return new Promise((resolve,reject) => {
        db.list({include_docs:true},(err, response) => {
            if(err)
                return reject(err)
            else {
                resolve(
                    teams = response
                )
            }
        })
    })
}

const updateTeams = ((teamOne, teamTwo) => {
    return new Promise((resolve, reject) => {
        db.get("f21aadbb2ed806c8f5819bbd67a8e7ee", (err, data) => {
            if(err)
                return reject(err)
            else {
                let _id = data._id
                let _rev = data._rev

                let teams = {_id, _rev, teamOne, teamTwo}
                db.insert(teams, (err, data) => {
                    if(err)
                        return reject(err)
                    else {
                        db.list({include_docs:true},(err, response) => {
                            if(err)
                                return reject(err)
                            else {
                                resolve(
                                    teams = response
                                )
                            }
                        })
                    }
                })
            }
        })
    })
})


const createTeam = (team => {
    return new Promise((resolve, reject) => {
        db.insert(team, (err) => {
            if(err)
                return reject(err)
            else {
                resolve()
            }
        })
    })
})

module.exports = {
    getAllTeams,
    updateTeams,
    createTeam
}

  