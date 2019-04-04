// Use dotenv to read .env vars into Node
require('dotenv').config();
var fs = require('fs');
var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM('').window;
global.document = document;

var $ = (jQuery = require('jquery')(window));

var keys = require('./keys.js');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var searchValue = process.argv[3];

// getBrands function that will search the Bands in Town Artist API
function getBrands() {
  axios
    .get(
      'https://rest.bandsintown.com/artists/' +
        searchValue +
        '/events?app_id=codingbootcamp'
    )
    .then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        console.log('Name of the venue', response.data[i].venue.name);
        console.log('Venue location', response.data[i].venue.country);
        console.log(
          'Date of the Event',
          moment(response.data[i].datetime).format('MM-DD-YYYY')
        );
        console.log('\n');
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

// spotifySongs function that show the information about the song
function spotifySongs() {
  spotify
    .search({ type: 'track', query: searchValue })
    .then(function(response) {
      if (response.tracks.items.length > 0) {
        for (var i = 0; i < response.tracks.items.length; i++) {
          for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
            console.log('artists', response.tracks.items[i].artists[j].name);
          }

          console.log('song name', response.tracks.items[i].name);
          console.log(
            'spotify song url',
            response.tracks.items[i].external_urls.spotify
          );
          console.log('song album name', response.tracks.items[i].album.name);
          console.log('\n');
        }
      } else {
        searchValue = 'The Sign';
        spotifySongs();
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

// getMovieInfo function that show information about the movie
function getMovieInfo() {
  var url = `http://www.omdbapi.com/?t=${searchValue}&apikey=${keys.omdb.key}`;

  axios
    .get(url)
    .then(function(response) {
      console.log('movie title', response.data.Title);
      console.log('movie year', response.data.Year);
      console.log('movie Imdb rating', response.data.imdbRating);
      console.log('movie Country', response.data.Country);
      console.log('movie Language', response.data.Language);
      console.log('movie Plot', response.data.Plot);
      console.log('movie Actors', response.data.Actors);

      for (var i = 0; i < response.data.Ratings.length; i++) {
        if (response.data.Ratings[i].Source == 'Rotten Tomatoes') {
          console.log('Rotten Tomatoes Rating', response.data.Ratings[i].Value);
        }
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

// getCommand function that get the text command from the file random.text
function getCommand() {
  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) throw err;
    var commandText = data.split(',');

    searchValue = commandText[1];
    spotifySongs();
  });
}

switch (command) {
  case 'concert-this':
    getBrands();
    break;
  case 'spotify-this-song':
    spotifySongs();
    break;
  case 'movie-this':
    getMovieInfo();
    break;
  case 'do-what-it-says':
    getCommand();
    break;
}
