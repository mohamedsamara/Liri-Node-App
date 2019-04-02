// Use dotenv to read .env vars into Node
require('dotenv').config();
var fs = require('fs');
var axios = require('axios');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM('').window;
global.document = document;

var $ = (jQuery = require('jquery')(window));

var keys = require('./keys.js');

var command = process.argv[2];
var value = process.argv[3];

// getBrands function that will search the Bands in Town Artist API
function getBrands() {
  axios
    .get(
      'https://rest.bandsintown.com/artists/' +
        value +
        '/events?app_id=codingbootcamp'
    )
    .then(function(response) {
      $.each(response, function(value) {
        console.log('response', response);
      });
    });
}

// getCommand function that get the text command from the file random.text
function getCommand() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    var commandText = data.split(',');
    console.log(commandText[1]);
  });
}

switch (command) {
  case 'concert-this':
    getBrands();
    break;
  case 'spotify-this-song':
    break;
  case 'movie-this':
    break;
  case 'do-what-it-says':
    getCommand();
    break;
}
