$(document).ready(function() {

//MAP WITH ISS LOCATION
  var map = L.map('map').setView([0, 0], 3);

//DISABLE MOUSE SCROLL ZOOM
  map.scrollWheelZoom.disable();
  function moveISS () {
      $.getJSON('https://galvanize-cors-proxy.herokuapp.com/http://api.open-notify.org/iss-now.json?callback=?', function(data) {
          var lat = data['iss_position']['latitude'];
          var lon = data['iss_position']['longitude'];

          iss.setLatLng([lat, lon]);
          isscirc.setLatLng([lat, lon]);
          map.panTo([lat, lon], animate=true);
      });
      // setTimeout(moveISS, 5000);
  }

//MAP TILE LAYERS
  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2hhc2Vyd2FzZXIyNSIsImEiOiJjajJxampiajAwM25jMndubjFqcDBydHRhIn0.KFNhZwQr6h5JY71n0mkfAQ', {
      maxZoom: 5,
  }).addTo(map);

//ISS MAP ICON
  var ISSIcon = L.icon({
      iconUrl: 'images/station.png',
      iconSize: [50, 30],
      iconAnchor: [25, 15],
      popupAnchor: [50, 25],
      shadowUrl: 'images/shadow.png',
      shadowSize: [60, 40],
      shadowAnchor: [30, 15]
  });

  var iss = L.marker([0, 0], {icon: ISSIcon}).addTo(map);
  var isscirc = L.circle([0,0], 2200e3, {color: "#c22", opacity: 0.3, weight:1, fillColor: "#c22", fillOpacity: 0.1}).addTo(map);

  moveISS();

//PASS TIMES AND PEOPLE ON BOARD
$(".btn").on("click", function(){
  var lats = $("[name='latitude']").val();
  var longs = $("[name='longitude']").val();
//PASSING IN LAT AND LON VALUES FOR PASS TIMES
  $.getJSON("https://galvanize-cors-proxy.herokuapp.com/http://api.open-notify.org/iss-pass.json?lat=" + lats + "&lon=" + longs + "&alt=20&n=1&callback=?", function(data) {
      data['response'].forEach(function (d) {
          var date = new Date(d['risetime']*1000);
           $('.passtimes').append('<h4>' + date.toString() + '</h4>');
      });

//POPULATE NUM OF ASTRONAUTS AND NAMES
  $.getJSON('http://api.open-notify.org/astros.json', function(data) {
    var html = "";
    var astroNum = "<h3>AND WAVE TO THE " + data.number + " ASTRONAUTS ON BOARD</h3>"
    for(people in data.people){
      html += "<h4>" + data.people[people].name.toUpperCase() + "</h4>"
    }
      $(".onboard").append(html);
      $(".astronautNum").append(astroNum)
    });
  });
  
//CLEAR RESULTS
  $('.passtimes').empty();
  $('.astronautNum').empty();
  $('.onboard').empty();
})

});
