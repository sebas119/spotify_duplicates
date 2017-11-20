angular
  .module("appSpotify", ["ui.router"])
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

    comun.getTokens = function(){
      $http({
        method : "GET",
        url : "get_tokens"
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
  .service("tokenService", function($http, $q) {
    return {
      getAll: getAll
   }

  function getAll () {
      var defered = $q.defer();
      var promise = defered.promise;

      $http.get('get_tokens')
          .success(function(data) {
              defered.resolve(data);
          })
          .error(function(err) {
              defered.reject(err)
          });

      return promise;
  }
  })
  .controller("ctrlLogin", function($scope, $state) {
    
  

   
    
    
  })
  .controller("ctrlPlaylist", function($scope, $state, tokenService, $stateParams) {
    var token = '';
    var param1 = $stateParams.accesstoken;
    alert(param1);
    tokenService
      .getAll()
      .then(function(data){
        token = data;
        
      }).catch(function(err){

      })
    
      console.log(token);




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
