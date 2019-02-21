require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var argAll = process.argv;
var command = argAll[2];
var name = "";
let date = "";
let dateArr =[];
let cDate = "";
for (let i = 3; i < argAll.length; i++) {

    if (i > 3 && i < argAll.length) {
  
      name = name + "+" + argAll[i];
  
    }
  
    else {
  
      name += argAll[i];
  
    }
  }
  

liri = function(command, name){
switch (command){
    case "concert-this":
    
        axios
            .get("https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp")
            .then (function(response){
                console.log("Venue: ",response.data[0].venue.name);
                console.log("Location: ",response.data[0].venue.city,response.data[0].venue.region);
                date = response.data[0].datetime;
                dateArr = date.split("T")
                cDate = dateArr[0];
                concertDate = moment(cDate,"YYYY/MM/DD").format("MM/DD/YYYY");
                console.log("Time: ",concertDate);
            })
        break;

    case "spotify-this-song":
        if (name === ""){
            name="the sign ace of base"
        }
        spotify
            .search({ type: 'track', query: name, limit: 20 })
            .then(function(response) {
                var songInfo = response.tracks.items[0];
                console.log("Artist: ",songInfo.artists[0].name);
                console.log("Song Title: ",songInfo.name);
                console.log("Preview Link: ",songInfo.preview_url);
                console.log("Album Title: ",songInfo.album.name);
            })
            .catch(function(err) {
                console.log(err);
            })
        break;
    
    case "movie-this":
        if (name === ""){
            name="mr nobody"
    }
        axios
            .get("http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy")
            .then (function(response){
                console.log("Title: ",response.data.Title);
                console.log("Year: ",response.data.Year);
                console.log("IMDB Rating: ",response.data.Ratings[0].Value);
                console.log("Rotten Tomato Rating: ",response.data.Ratings[1].Value);
                console.log("Country: ",response.data.Country);
                console.log("Language: ",response.data.Language);
                console.log("Plot: ",response.data.Plot);
                console.log("Actors: ",response.data.Actors);

            })
        break;
    
    case "do-what-it-says":
        
        fs.readFile("random.txt","utf8", function(error, data){
            if (error){
                return console.log(error);
            }

            console.log(data);
            var dataArr = data.split(",");
            command = dataArr[0];
            name = dataArr[1];
            liri(command, name);
        })
}
}
liri(command, name);