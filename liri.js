var keys = require("./keys.js");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require('node-spotify-api');
var fs = require("fs");

var client = new Twitter(keys.twitterKeys);

var input1 = process.argv[2];
var input2 = process.argv.slice(3);


function twitterApi() {
	var params = {
        screen_name: 'jkbridges4',
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            tweets.forEach(function(individualTweet) {
                console.log(`Time: ${individualTweet.created_at}`);
                console.log(`Tweet: ${individualTweet.text}`);
                console.log("\n--------------------------------\n");
            })
        }
    });
}

function spotifyApi() {
	if (input2.length < 1) {
        input2 = "The Sign Ace of Base";
    };

    var spotify = new Spotify(keys.spotifyKeys);

    spotify.search({
        type: 'track',
        query: input2
    }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var spotifyObj = data.tracks.items[0];
        console.log(`Artist: ${spotifyObj.artists[0].name}`);
        console.log(`Song: ${spotifyObj.name}`);
        console.log(`Preview: ${spotifyObj.preview_url}`);
        console.log(`Album: ${spotifyObj.album.name}`);
    });
}

function omdbApi() {
	if (input2.length < 1) {
		input2 = "Mr. Nobody";
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + input2 + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var obj = JSON.parse(body);
            console.log(`Title: ${obj.Title}`);
            console.log(`Release Date: ${obj.Year}`);
            console.log(`IMDb Rating: ${obj.imdbRating}`);
            console.log(`Rotten Tomatos Rating: ${obj.Ratings[1].Value}`);
            console.log(`Country: ${obj.Country}`);
            console.log(`Plot: ${obj.Plot}`);
            console.log(`Actors: ${obj.Actors}`);
        }
    });
}

// function logInfo() {
// 	fs.appendFile("log.txt", )
// }

if (input1 === "my-tweets") {
	twitterApi();
} else if (input1 === "spotify-this-song") {
	spotifyApi();
} else if (input1 === "movie-this") {
	omdbApi();
} else if (input1 === "do-what-it-says") {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}
		switch (data.split(',')[0]) {
            case 'my-tweets':
                twitterApi();
                break;
            case 'spotify-this-song':
                spotifyApi(data.split(',')[1].trim());
                break;
            case 'movie-this':
                omdbApi(data.split(',')[1].trim());
                break;
        }
	});
}