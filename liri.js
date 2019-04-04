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
      $.each(response.data, function(index, value) {
        console.log('Name of the venue', value.venue.name);
        console.log('Venue location', value.venue.country);
        console.log(
          'Date of the Event',
          moment(value.venue.datetime).format('MM-DD-YYYY')
        );
        console.log('\n');
      });
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
        $.each(response.tracks.items, function(index, value) {
          $.each(value.artists, function(index, item) {
            console.log('artists', item.name);
          });
          console.log('song name', value.name);
          console.log('spotify song url', value.external_urls.spotify);
          console.log('song album name', value.album.name);
          console.log('\n');
        });
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

      $.each(response.data.Ratings, function(index, value) {
        if (value.Source == 'Rotten Tomatoes') {
          console.log('Rotten Tomatoes Rating', value.Value);
        }
      });
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
