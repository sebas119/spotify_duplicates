var express = require('express');
var request = require('request'); // "Request" library
var querystring = require('querystring');
var User = require('../models/users');
var router = express.Router();
var _ = require('lodash');


router.get('/my_playlists', function(req, res) {

    // requesting access token from refresh token
    var access_token = req.query.access_token;

    var authOptions = {
        url: 'https://api.spotify.com/v1/me/playlists?limit=10',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        json: true
    };

    request.get(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            resBody = body.items;

            res.send({
                'playlists': resBody
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
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        json: true
    };

    request.get(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var trackItems = body.items;


            //Funciones de lodash que me sacan un json con los elementos con Ids duplicados  
            var grouped = _.countBy(body.items, function(item) {
                return item.track.id;
            });

            var duplicateInvoiceIds = [];
            _.filter(grouped, function(qty, key) {
                if (qty > 1) duplicateInvoiceIds.push(key);
            });

            var result = _.filter(body.items, function(item) {
                return _.indexOf(duplicateInvoiceIds, item.track.id) > -1;
            });

            //Probando.......
            var array = body.items;
            var hash = {};
            array = array.filter(function(current) {
                var exists = !hash[current.track.id] || false;
                hash[current.track.id] = true;
                return exists;
            });
            //End Probando
            
            res.send({
                'tracks': trackItems,
                'duplicates': result,
                'cleantracks': array
            })
        } else {
            console.log(error);
        }
    });
});

router.get('/get_multiple_tracks', function (req, res) {
  var user_id = req.query.user_id;
  var playlist_id = req.query.playlist_id;
  // requesting access token from refresh token
  var access_token = req.query.access_token;
  var trackItems1 = {};
  var trackItems2 = {};

  var authOptions1 = {
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id[0] + '/tracks',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    json: true
  };

  var authOptions2 = {
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id[1] + '/tracks',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    json: true
  };

  request.get(authOptions1, function (error, response, body) {
    if (!error && response.statusCode === 200) {
       trackItems1 = body.items;       
      request.get(authOptions2, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          trackItems2 = body.items;
          res.send({
            'track1': trackItems1,
            'track2': trackItems2           
          });
        } else {
          console.log(error);
        }
      });

    } else {
      console.log(error);
    }
  });

  

 


});

router.get('/delete_track', function(req, res) {
    var user_id = req.query.user_id;
    var playlist_id = req.query.playlist_id;
    // requesting access token from refresh token
    var access_token = req.query.access_token;
    var position = parseInt(req.query.position);
    var trackUri = req.query.uri;


    var data_body = {
        tracks: [{
            position: [position],
            uri: trackUri
        }]
    };

    var authOptions = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        body: data_body,
        json: true
    };

    request.del(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send({
                'data': body
            });
        } else {
            console.log(error);
        }
    });
})




router.get('/update_tracks', function(req, res) {
    var user_id = req.query.user_id;
    var playlist_id = req.query.playlist_id;
    // requesting access token from refresh token
    var access_token = req.query.access_token;
    //var position = parseInt(req.query.position);
    var trackUri = req.query.uri;

    var data_body = {                    
            uris: trackUri        
    }; 

    var authOptions = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        body: data_body,
        json: true
    };

    //console.log(authOptions);

    request.put(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 201) {
            res.send({
                'data': body
            });
        } else {
            console.log(error);
        }
    });
})

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