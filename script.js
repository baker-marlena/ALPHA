window.onload = function() {

//MAP WITH ISS
  var map = L.map('map').setView([0, 0], 3);
  var geolocate = document.getElementById('geolocate');
  map.scrollWheelZoom.disable();

  if (!navigator.geolocation) {
geolocate.innerHTML = 'geolocation is not available';
} else {
geolocate.onclick = function (e) {
e.preventDefault();
e.stopPropagation();
map.locate();
};
}

map.on('locationfound', function(e) {
map.fitBounds(e.bounds);

map.markerLayer.setGeoJSON({
type: "Feature",
geometry: {
type: "Point",
coordinates: [e.latlng.lng, e.latlng.lat]
},
properties: {
'marker-color': '#000',
'marker-symbol': 'star-stroked'
}
});

// And hide the geolocation button
geolocate.parentNode.removeChild(geolocate);
console.log(coordinates)
});


  function moveISS () {
      $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
          var lat = data['iss_position']['latitude'];
          var lon = data['iss_position']['longitude'];

          iss.setLatLng([lat, lon]);
          isscirc.setLatLng([lat, lon]);
          map.panTo([lat, lon], animate=true);
      });
      setTimeout(moveISS, 60000);
  }

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2hhc2Vyd2FzZXIyNSIsImEiOiJjajJxampiajAwM25jMndubjFqcDBydHRhIn0.KFNhZwQr6h5JY71n0mkfAQ', {
      maxZoom: 13,
  }).addTo(map);

  var ISSIcon = L.icon({
      iconUrl: 'images/station.png',
      iconSize: [50, 30],
      iconAnchor: [25, 15],
      popupAnchor: [50, 25],
      // shadowUrl: '/Open-Notify-API/map/ISSIcon_shadow.png',
      shadowSize: [60, 40],
      shadowAnchor: [30, 15]
  });

  var iss = L.marker([0, 0], {icon: ISSIcon}).addTo(map);
  var isscirc = L.circle([0,0], 2200e3, {color: "#c22", opacity: 0.3, weight:1, fillColor: "#c22", fillOpacity: 0.1}).addTo(map);

  moveISS();

  //NAMES OF PEOPLE ON BOARD THE ISS
//   $.getJSON('http://api.open-notify.org/astros.json', function(data) {
//     var html = "";
//     for(people in data.people){
//        html += "<li>" + data.people[people].name + "</li>"
//     }
//     $(".modal-body").append(html);
//
// });

//PASS TIMES
$(".btn").on("click", function(){
  var lats = $("[name='latitude']").val();
  var longs = $("[name='longitude']").val();
  $.getJSON("http://api.open-notify.org/iss-pass.json?lat=" + lats + "&lon=" + longs + "&alt=20&n=5&callback=?", function(data) {
      data['response'].forEach(function (d) {
          var date = new Date(d['risetime']*1000);
           $('.modal-body').append('<li>' + date.toString() + '</li>');
      });
  });
  $('.modal-body').empty();
})

};
