(function() {
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

  var userProfileSource = document.getElementById("user-profile-template")
      .innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById("user-profile");

  var oauthSource = document.getElementById("oauth-template").innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById("oauth");

  var playlistSource = document.getElementById("playlist-name-template")
      .innerHTML,
    playlistTemplate = Handlebars.compile(playlistSource),
    playlistPlaceholder = document.getElementById("playlist");

  var params = getHashParams();

  var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

  var user_id;

  if (error) {
    alert("There was an error during the authentication");
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });

      $.ajax({
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + access_token
        },
        success: function(response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          user_id = response.id;
          console.log(response.id);
          $("#login").hide();
          $("#loggedin").show();
        }
      });
    } else {
      // render initial screen
      $("#login").show();
      $("#loggedin").hide();
    }

    document.getElementById("obtain-new-token").addEventListener(
      "click",
      function() {
        $.ajax({
          url: "/refresh_token",
          data: {
            refresh_token: refresh_token
          }
        }).done(function(data) {
          access_token = data.access_token;
          oauthPlaceholder.innerHTML = oauthTemplate({
            access_token: access_token,
            refresh_token: refresh_token
          });
        });
      },
      false
    );

    $("#get_playlist").click(function() {
      $.ajax({
        url: "/user/my_playlists",
        data: {
          access_token: access_token
        }
      }).done(function(data) {
        var playlist = data.playlists;
        var html = '<div id="accordion" role="tablist">';
        
        $.each(playlist, function(key, value) {
          if (value.owner.id == user_id) {
            html += accordionHtml(value.name,value.id,user_id,access_token);
          }
        });

        $("#playlist").html(html + '</div>');
        $("#data_playlist").show();

        /*var jsonPlaylist = {
                playlists: playlist
              }
              playlistPlaceholder.innerHTML = playlistTemplate(jsonPlaylist);
              */
      });
    });
    
  }
  
})();

function accordionHtml(name,v_id,u_id,token){
 var html = '<div class="card">'+
  '<div class="card-header" role="tab" id="headingOne">'+
   '<h5 class="mb-0">'+
      '<a data-toggle="collapse" href="#collapseOne_'+v_id+'" aria-expanded="true" aria-controls="collapseOne_'+v_id+'" onclick="getTracks('+'\''+v_id+'\', \''+u_id  +'\', \''+token +'\'' +')">'+
      name +
      '</a>'+
    '</h5>'+
  '</div>'+

  '<div id="collapseOne_'+v_id+'" class="collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion">'+
    '<div id="bodyCollapseOne_'+v_id+'" class="card-body">'+
        "Cargando contenido..."+//aqui va el contenido de la lista
    '</div>'+
  '</div>'+
  '</div>'
  ;

  return html;
}

function getTracks(playlistId, userId, accessToken) {
  $.ajax({
    url: "/user/get_tracks",
    data: {
      user_id : userId,
      playlist_id: playlistId,
      access_token: accessToken
    }
  }).done(function(data) {      
      var tracks = data.tracks;

      var html = "";

      $.each(tracks, function(key, value) {        
          html += '<button class="btn btn-link">' + value.track.name + '</button></br>';        
      });

      $("#bodyCollapseOne_"+playlistId).html(html);
     // $("#my_tracks").show();

  });
}