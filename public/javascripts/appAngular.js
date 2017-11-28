angular
    .module("appSpotify", ["ui.router", "ui.filters"])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("login", {
                url: "/startlogin",
                templateUrl: "views/login.html",
                controller: "ctrlLogin"
            })
            .state("playlist", {
                url: "/playlist/:accesstoken/:refreshtoken",
                templateUrl: "views/playlist.html",
                controller: "ctrlPlaylist"
            });

        $urlRouterProvider.otherwise("startlogin");
    })
    .factory("comun", function($http) {
        //Se inyecta el metodo http
        var comun = {};

        comun.tokens = [];

        comun.token = {};

        comun.getTokens = function() {
            $http({
                method: "GET",
                url: "get_tokens"
            }).then(function mySuccess(response) {
                console.log(response.data);
                angular.copy(response.data, comun.tokens);
                return comun.tokens;
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });

        }

        /**
         * Seccion de metodos remotos
         */
        return comun;
    })
    /*.service("tokenService", function ($http, $q) {
      return {
        getAll: getAll
      }

      function getAll() {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('get_tokens')
          .success(function (data) {
            defered.resolve(data);
          })
          .error(function (err) {
            defered.reject(err)
          });

        return promise;
      }
    })*/
    .controller("ctrlLogin", function($scope, $state) {

    })
    .controller("ctrlPlaylist", function($scope, $state, $stateParams, $http) {

        var access_token = $stateParams.accesstoken;
        var refresh_token = $stateParams.refreshtoken;

        $scope.accesstoken = access_token;
        $scope.refreshtoken = refresh_token;

        $scope.selected = []; //Aqui van almacendados los playlist_id

        $scope.refrescarToken = function() {
            $http({
                method: "GET",
                url: "/refresh_token",
                params: {
                    refresh_token: refresh_token
                }
            }).then(function mySuccess(response) {
                $scope.accesstoken = response.data.access_token;
                console.log(response.data);
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });
        }

        $http({
            method: "GET",
            url: "/get_data_user",
            params: {
                access_token: access_token
            }
        }).then(function mySuccess(response) {
            $scope.datauser = response.data;
            //user_id = response.data.id;
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });

        //$scope.obtenerPlaylist = function () {
        $http({
            method: "GET",
            url: "/user/my_playlists",
            params: {
                access_token: access_token
            }
        }).then(function mySuccess(response) {
            var playlist = response.data.playlists;
            $scope.playlists = playlist;
            //console.log(playlist);

        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });
        //}

        $scope.addPlaylist = function(item, list) {
            var idx = list.indexOf(item);

            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                if (list.length <= 1) { //para solo seleccionar dos listas maximo
                    list.push(item);
                }
            }
        }

        $scope.existsPlaylist = function(item, list) {
            return list.indexOf(item) > -1;
        }

        $scope.getTracks = function(playlistId, userId) {
            $http({
                method: "GET",
                url: "/user/get_tracks",
                params: {
                    user_id: userId,
                    playlist_id: playlistId,
                    access_token: access_token
                }
            }).then(function mySuccess(response) {
                var track = response.data.tracks;
                var duplicates = response.data.duplicates;
                var cleantracks = response.data.cleantracks;

                //Here I save in this array all the uris
                cleantracksUris = [];
                angular.forEach(cleantracks, function(value, key) {
                    cleantracksUris.push(value.track.uri);
                });




                $scope.cleantracksUris = cleantracksUris;
                $scope.duplicates = duplicates;
                $scope.tracks = track;
                //console.log($scope.tracks);
                //console.log(response.data.duplicates);
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });
        }

        $scope.deleteTrack = function(position, trackUri, playlistId, userId) {
            $http({
                method: "GET",
                url: "/user/delete_track",
                params: {
                    user_id: userId,
                    playlist_id: playlistId,
                    access_token: access_token,
                    position: position,
                    uri: trackUri
                }
            }).then(function mySuccess(response) {
                //console.log(response.data);        
            }, function myError(response) {
                $scope.myWelcome = response.statusText;
            });
        }


        $scope.deleteDuplicates = function(trackUris, playlistId, userId, duplicates) {
                if (duplicates.length > 0) {
                    $http({
                        method: "GET",
                        url: "/user/update_tracks",
                        params: {
                            user_id: userId,
                            playlist_id: playlistId,
                            access_token: access_token,
                            uri: trackUris
                        }
                    }).then(function mySuccess(response) {
                        console.log(response.data);
                    }, function myError(response) {
                        $scope.myWelcome = response.statusText;
                    });
                } else {
                    alert('No existen canciones repetidas');
                }
            }
            /*var token = '';
              $http({
                method : "GET",
                url : "get_tokens"      
              }).then(function mySuccess(response) {        
                  $scope.accesstoken = response.data.access_token;                
              }, function myError(response) {
                  $scope.myWelcome = response.statusText;
              });*/







    });