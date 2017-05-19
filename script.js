$(document).ready(function() {

$("#myModal").modal("show");


//MAP WITH ISS LOCATION
  var map = L.map('map').setView([0, 0], 3);

//DISABLE MOUSE SCROLL ZOOM
  map.scrollWheelZoom.disable();
  function moveISS () {
      $.getJSON('https://galvanize-cors-proxy.herokuapp.com/http://api.open-notify.org/iss-now.json?callback=?', function(data) {
          var lat = data["iss_position"]["latitude"];
          var lon = data["iss_position"]["longitude"];
          iss.setLatLng([lat, lon]);
          isscirc.setLatLng([lat, lon]);
          map.panTo([lat, lon], animate=true);
      });
      setTimeout(moveISS, 60000);
  }

//MAP TILE LAYERS
  L.tileLayer("https://galvanize-cors-proxy.herokuapp.com/http://b.tiles.mapbox.com/v3/paldhous.earth_at_night,paldhous.cities_and_countries/{z}/{x}/{y}.png", {
      maxZoom: 5,
  }).addTo(map);

//ISS MAP ICON
  var ISSIcon = L.icon({
      iconUrl: "images/iss.png",
      iconSize: [50, 30],
      iconAnchor: [25, 15],
      popupAnchor: [50, 25],
      shadowUrl: "images/iss_shadow.png",
      shadowSize: [60, 40],
      shadowAnchor: [30, 15]
  });

  var iss = L.marker([0, 0], {icon: ISSIcon}).addTo(map);
  var isscirc = L.circle([0,0], 2200e3, {color: "#f5dda2", opacity: 0.3, weight:2, fillColor: "#000", fillOpacity: 0.1}).addTo(map);

  moveISS();

$("[name='dropdown']").change(function(){
  $("[name='longitude']").attr("placeholder","")
  $("[name='latitude']").attr("placeholder","")
  var option = $("[name='dropdown']").val();
    switch(option){
      case "DALLAS":
      $("[name='latitude']").val("32.7833333");
      $("[name='longitude']").val("-96.8");
      break;
      case "DENVER":
      $("[name='latitude']").val("39.7391667");
      $("[name='longitude']").val("-104.9841667");
      break;
      case "HONOLULU":
      $("[name='latitude']").val("21.3069444");
      $("[name='longitude']").val("-157.8583333");
      break;
      case "JACKSONVILLE":
      $("[name='latitude']").val("30.3319444");
      $("[name='longitude']").val("-81.6558333");
      break;
      case "NEW YORK":
      $("[name='latitude']").val("40.7141667");
      $("[name='longitude']").val("-74.0063889");
      break;
      case "PHOENIX":
      $("[name='latitude']").val("33.4483333");
      $("[name='longitude']").val("-112.0733333");
      break;
      case "SAN FRANCISCO":
      $("[name='latitude']").val("37.775");
      $("[name='longitude']").val("-122.4183333");
      break;
      case "SEATTLE":
      $("[name='latitude']").val("47.6063889");
      $("[name='longitude']").val("-122.3308333");
      break;
    }
})


//PASS TIMES AND PEOPLE ON BOARD
$(".btn").on("click", function(){
  $(".modal-body").empty();
  var lats = $("[name='latitude']").val();
  var longs = $("[name='longitude']").val();
  var error = "<p>WE COULD NOT MAKE A PROPER CALCULATION. PLEASE CHECK YOUR LONGITUDE AND LATITUDE INPUTS!</p>"
//PASSING IN LAT AND LON VALUES FOR PASS TIMES
if(lats == "" || longs == ""){
  $(".modal-body").html(error);

} else {

  $.getJSON("https://galvanize-cors-proxy.herokuapp.com/http://api.open-notify.org/iss-pass.json?lat=" + lats + "&lon=" + longs + "&alt=20&n=1&callback=?", function(data) {
      data["response"].forEach(function (d) {
          var date = new Date(d['risetime']*1000);
           $(".modal-body").append("<h3>CALCULATIONS PREDICT THE SPACE STATION WILL PASS YOU ON... </h3>" + "<h5>" + date.toString().toUpperCase() + "</h5>");
      });

//POPULATE NUM OF ASTRONAUTS AND NAMES
  $.getJSON('https://galvanize-cors-proxy.herokuapp.com/http://api.open-notify.org/astros.json', function(data) {
    var html = "";
    var astroNum = "<h3>THERE ARE CURRENTLY " + data.number + " ASTRONAUTS ON BOARD</h3>"
    for(people in data.people){
      html += "<h5><a href='https://en.wikipedia.org/wiki/" + data.people[people].name + "'>" + data.people[people].name.toUpperCase() + "</a></h5>"
    }
      $(".modal-body").append(astroNum)
      $(".modal-body").append(html);
    });
  });

}
})

});
