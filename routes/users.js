var express = require('express');
var request = require('request'); // "Request" library
var querystring = require('querystring');
var User = require('../models/users');
var router = express.Router();


router.get('/my_playlists', function(req, res) {
  
    // requesting access token from refresh token
    var access_token = req.query.access_token;
    
    var authOptions = {
      url: 'https://api.spotify.com/v1/me/playlists?limit=10',
      headers: { 'Authorization': 'Bearer ' + access_token },      
      json: true
    };
  
    request.get(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        resBody = body.items;

        res.send({
          'playlists' : resBody
        });
      }
    });
  });


router.get('/get_tracks', function(req, res) {
    var user_id = req.query.user_id;
    var playlist_id = req.query.playlist_id;
    // requesting access token from refresh token
    var access_token = req.query.access_token;
    
    var authOptions = {
      url: 'https://api.spotify.com/v1/users/'+user_id+'/playlists/'+playlist_id+'/tracks',
      headers: { 'Authorization': 'Bearer ' + access_token },      
      json: true
    };
  
    request.get(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        trackItems = body.items;
        res.send({
          'tracks' :trackItems
        })
      }else{
        console.log(error);
      }
    });
  });

/*router.route('')
  .get(function(req, res) {
      User
        .fetchAll()
        .then(function(users) {
          res.json({ users });
        });
    })
  .post(function(req, res){

    var user_data = req.query.user;

    if(req.query){
      console.log(user_data);
      res.status(400);
      res.send('No se ha enviado nada');
    }else{
      new User({
        displayName: req.body.displayName
      })
        .save()
        .then(function(save){
          res.json({save});
        })
    }
    
  });*/
  


  module.exports = router;