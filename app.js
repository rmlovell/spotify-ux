// dependanices
const express = require('express'); 
const request = require('request'); 
const session = require('express-session')
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
//const exphbs = require('exphbs')
const exphbs = require('express-handlebars');
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');
const { get } = require('request');
//var fetch = require("fetch");

// keys and ports 
const client_id = 'b486fa09acbd42269c55c353968aa42d'; // Add Your client id
const client_secret = '2f442e8f8db549da96042f11edff402b'; // Add Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
const stateKey = 'spotify_auth_state';
const port = process.env.PORT || 8888;

// Object that contains collections
let storedCollections = {};
// Contains current token
let token = "";

// app creation
var app = express();

// intialize middleware
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(cors())
   .use(cookieParser())
   .use(session({
     secret: 'secret-key',
     resave: false,
     saveUnintialized: false,
   }));


   app.engine('handlebars', exphbs({
    defaultLayout: 'default',
    
  }));
  app.set('view engine', 'handlebars');


//home page
app.get('/', function(req, res) {
    res.render('index');
});

// Sends token
app.get('/token', function(req, res) {
  res.send(token);
});

// collection page
app.get('/milkcrate', function(req, res) {



  var options = {
    url: 'https://api.spotify.com/v1/me/albums?limit=40&offset=0&market=ES',
    headers: { 
      'Authorization': 'Bearer ' + req.session.access_token,
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
   },
    json: true
  };

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {

    console.log("-----------------------------------------------------");
    var collection = [];
    var albums = [];
    var pos = 100;
    var zIndex = 20;

    body.items.forEach(el => {
      pos = pos - 10;
      zIndex = zIndex - 1;
      var album = {
        "name" : el.album.name,
        "img" : el.album.images[1].url,
        "pos" : pos,
        "zIndex" : zIndex,
        "id" :  el.album.id,
        "popularity" : el.album.popularity,
        "release" : el.album.release_date,
        "artist-name" : el.album.artists[0].name,
        "album-uri" : el.album.uri
      }
      console.log(body.items);
      albums.push(album);
      if (pos <= 0){
        collection.push(albums);
        albums = [];
        pos = 100;
        zIndex = 20;
      }
      
    });
    if(albums.length > 0){
      collection.push(albums);
    }
    //console.log(collection);

    // Updates global collection variable with recently loaded collections
    storedCollections = collection;

    res.render('collection', {collection : collection});
    
  })
  
  //res.render('collection', {albums : albums});

});

// Sends collection in json format
app.get('/milkcrate/json', function(req, res) {
  res.send(storedCollections);
});


// discover page
app.get('/discover', function(req, res) {
  var topArtists = [];
  var topArtistsString = "";
  // in view folder there is a discover.hbs file that is your html
  // gather all the data you need here and pass it -vvvvv- here.
  var artists = {
    url: 'https://api.spotify.com/v1/me/top/artists?limit=5',
    method: 'GET',
    headers: { 
      'Authorization': 'Bearer ' + req.session.access_token,
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
   },
    json: true
  };
  request.get(artists, function(err, response, body) {
    body.items.forEach(el => {
      topArtists.push(el.id);
    })
    topArtistsString = topArtists.toString();
    var recommendations = {
      url: `https://api.spotify.com/v1/recommendations?limit=50&seed_artists=${topArtistsString}&market=US`,
      method: 'GET',
      headers: { 
        'Authorization': 'Bearer ' + req.session.access_token,
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
     },
      json: true
    };
    request.get(recommendations, function(err, response2, body) {
      var collection = [];
      var albums = [];
      var albumIds = [];
      var pos = 100;
      var zIndex = 20;

      body.tracks.forEach(el => {
        if(albumIds.includes(el.album.id)) {
          return;
        }
        pos = pos - 10;
        zIndex = zIndex - 1;
        var album = {
          "name" : el.album.name,
          "img" : el.album.images[1].url,
          "pos" : pos,
          "zIndex" : zIndex,
          "id" :  el.album.id,
          "popularity" : el.popularity,
          "release" : el.album.release_date,
          "artist-name" : el.album.artists[0].name
        }
        albumIds.push(album.id);
        albums.push(album);
        if (pos <= 0){
          collection.push(albums);
          albums = [];
          pos = 100;
          zIndex = 20;
        }
      });
      if(albums.length > 0){
        collection.push(albums);
      }

      storedCollections = collection;

      res.render('discover', {collection : collection});
    });
  }); 
});

// get albums Api
app.get('/getAlbums', function(req, res){

  

});

// search albums api
app.post('/searchAlbums', function(req, res){
  console.log(req.body.text);

  var options = {
    url: 'https://api.spotify.com/v1/search?q='+ req.body.text +'&type=album&limit=5',
    headers: { 
      'Authorization': 'Bearer ' + req.session.access_token,
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
   },
    json: true
  };

  request.get(options, function(error, response, body) {
    var albums = []
    body.albums.items.forEach(el => {
      var album = {
        "artistName" : el.artists[0].name,
        "img" : el.images[2].url,
        "albumName" : el.name,
        "id" : el.id
      }
      albums.push(album);
    });
    //var packed ={"albums" : albums};
    res.send(JSON.stringify(albums));

  });

});

// sort albums api
app.post('/addAlbums', function(req, res){
  console.log(req.body.id);
  var options = {
    url: 'https://api.spotify.com/v1/me/albums?ids=' + req.body.id,
    method: 'PUT',
    headers: { 
      'Authorization': 'Bearer ' + req.session.access_token,
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
   },
    json: true
  };

  request(options, function(error, response, body) {
    console.log(response);
  });

});
// delete album
app.post('/deleteAlbums', function(req, res){
  console.log(req.body);
  var options = {
    url: 'https://api.spotify.com/v1/me/albums?ids=' + req.body.id,
    method: 'DELETE',
    headers: { 
      'Authorization': 'Bearer ' + req.session.access_token,
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
   },
    json: true
  };

  request(options, function(error, response, body) {
    // console.log(response);
  });

});

// discover albums
app.get('/discoverAlbums', function(req, res){

  

});


//-------------------------- dont worry about any of this -----------------------------------------------

// ask for user data at login
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'streaming user-read-private user-read-email user-library-read user-library-modify user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// receive user data from login
app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        token = access_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        console.log(access_token);
        console.log(refresh_token);
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
        res.redirect('/milkcrate');
        
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// get new token if old onw is busted

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};



// port listening

console.log('Listening on 8888');
app.listen(port);
