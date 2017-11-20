angular
  .module("appSpotify", ["ui.router"])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("login", {
        url: "/startlogin",
        templateUrl: "views/login.html",
        controller: "ctrlLogin"
      })
      .state("callback", {
        url: "/",
        templateUrl: "views/playlist.html",
        controller: "ctrlCallback"
      });

    $urlRouterProvider.otherwise("startlogin");
  })
  .factory("comun", function($http) {
    //Se inyecta el metodo http
    var comun = {};

    comun.tareas = [];

    comun.tarea = {};



    /**
         * Seccion de metodos remotos
         */
    return comun;
  })
  .controller("ctrlLogin", function($scope, $state) {
    
    
      /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
      function getHashParams() {
        var hashParams = {};
        var e,
          r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
        while ((e = r.exec(q))) {
          hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
      }

      var params = getHashParams();

      var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

      if (error) {
        alert("There was an error during the authentication");
      } else {
        if (access_token) {
          $.ajax({
            url: "https://api.spotify.com/v1/me",
            headers: {
              Authorization: "Bearer " + access_token
            },
            success: function(response) {
              console.log(response.id);
              $state.go("callback");
            }
          });
        } else {
          // render initial screen
          $("#login").show();
          $("#loggedin").hide();
        }

        
      }
   
    
    
  })
  .controller("ctrlCallback", function($scope, $state) {
   
  });
