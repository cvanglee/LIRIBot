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
var log = [];
var divider =
    "\n---------------------------------------------------------------------------------------------------------------\n\n";
  
name = process.argv.slice(3).join(" ");

liri = function(command, name){
switch (command){
    case "concert-this":
        if (name!==""){
        axios
            .get("https://rest.bandsintown.com/artists/" + name + "/events?app_id="+process.env.BANDS_IN_TOWN_API)
            .then (function(response){

                date = response.data[0].datetime;
                dateArr = date.split("T")
                cDate = dateArr[0];
                concertDate = moment(cDate,"YYYY/MM/DD").format("MM/DD/YYYY");
                log = [
                    "Venue: " + response.data[0].venue.name,
                    "\nLocation: " + response.data[0].venue.city+response.data[0].venue.region,
                    "\nTime: " + concertDate
                ].join("\n");
                fs.appendFile("log.txt", log + divider, function(err) {
                    if (err) throw err;
                  });
                console.log(log);
            })
            .catch(function (error) {
                log = ["Please enter a different artist or band\n", error].join("\n");
                fs.appendFile("log.txt", log + divider, function(err) {
                    if (err) throw err;
                  });
                console.log(log);
              });
        }
        else {
            log = "Please enter an artist or band for concert-this";
            fs.appendFile("log.txt", log + divider, function(err) {
                if (err) throw err;
              });
            console.log(log);
        }
        break;

    case "spotify-this-song":
        if (name === ""){
            name="the sign ace of base"
        }
        spotify
            .search({ type: 'track', query: name, limit: 20 })
            .then(function(response) {
                var songInfo = response.tracks.items[0];
                log = [
                "Artist: "+songInfo.artists[0].name,
                "Song Title: "+songInfo.name,
                "Preview Link: "+songInfo.preview_url,
                "Album Title: "+songInfo.album.name,
                ].join("\n");
                fs.appendFile("log.txt", log + divider, function(err) {
                    if (err) throw err;
                  });
                console.log(log);
            })
            .catch(function(error) {
                log = ["Please enter a different song\n", error].join("\n");
                fs.appendFile("log.txt", log + divider, function(err) {
                    if (err) throw err;
                  });
                console.log(log);
              });
        break;
    
    case "movie-this":
        if (name === ""){
            name="mr nobody"
    }
        axios
            .get("http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey="+process.env.IMDB_API)
            .then (function(response){
                log =[
                    "Title: " + response.data.Title,
                    "Year: " + response.data.Year,
                    "IMDB Rating: " + response.data.Ratings[0].Value,
                    "Rotten Tomato Rating: " + response.data.Ratings[1].Value,
                    "Country: " + response.data.Country,
                    "Language: " + response.data.Language,
                    "Plot: " + response.data.Plot,
                    "Actors: " + response.data.Actors
                ].join("\n");
                fs.appendFile("log.txt", log + divider, function(err) {
                    if (err) throw err;
                  });
                console.log(log);
            })
            .catch(function (error) {
                log = ["Please enter a different movie\n", error].join("\n");
                fs.appendFile("log.txt", log + divider, function(err) {
                    if (err) throw err;
                  });
                console.log(log);
              });
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
        break;
}
}
liri(command, name);