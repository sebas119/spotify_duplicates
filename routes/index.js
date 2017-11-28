var express = require('express');
var request = require('request'); // "Request" library
var querystring = require('querystring');
var User = require('../models/users');
var router = express.Router();

var client_id = '8ccc9b20802541f299f19b036c7fd40e'; // Your client id
var client_secret = '68c5fced61fd478cb64959eb83fa703c'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


var AccessToken = '';
var RefreshToken = '';
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

var stateKey = 'spotify_auth_state';

router.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/callback', function(req, res) {

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
        
        AccessToken = access_token;
        RefreshToken = refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          var user_id = body.id;
          var bd_id = '';
          var imagenPerfil = "";
          
          //Registra el ingreso de un usuario en la app o lo actualiza si ya había ingresado previamente
          new User({ "idUserSpotify": user_id})
            .fetch()
            .then(function(model) {
              // outputs 'Slaughterhouse Five'
              if (model) {
                bd_id = model.get("idUserSpotify");
                User.where({ idUserSpotify: bd_id })
                  .save({ last_entry: "NOW()" },{method: "update"})
                  .then(function(user) {
                    //console.log(user);
                  });
              }else {
                new User({
                  idUserSpotify: body.id,
                  displayName: body.display_name,
                  emailAddress: body.email,
                  spotifyUri: body.uri,
                  linkUserSpotify: body.href,
                  profileImageLink: imagenPerfil
                })
                  .save()
                  .then(function(save) {
                    //console.log(save);
                  });
              }                
            });
          
        });

        //Se pueden pasar los parametros de esta forma
        res.redirect('/#/playlist/'+access_token+'/'+refresh_token);
        // we can also pass the token to the browser to make requests from there
        /*res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));*/
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

router.get('/refresh_token', function(req, res) {

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

router.get('/get_tokens', function(req, res) {
  
    var access_token = AccessToken;
    var refresh_token = RefreshToken;

    var tokens = {
      access_token: access_token,
      refresh_token: refresh_token
    }

    res.json(tokens); 
    
  });

router.get('/get_data_user', function (req, res) {

  var access_token = req.query.access_token;
  

  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };

  request.get(options, function (error, response, body) {
    res.send(body);
    
  });

});

module.exports = router;
