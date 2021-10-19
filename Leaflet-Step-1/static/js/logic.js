var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson";

// Perform a GET request to the query URL
d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Where: " + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br><h2> Magnitude: " + feature.properties.mag + "</h2>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  function createCircleMarker(feature,latlng){
    let options = {
        radius:feature.properties.mag*5,
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: .8,
        fillOpacity: 0.35
    }
    return L.circleMarker(latlng, options);
}
  
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Function to choose color of cirlces for Map Plot based on Magnitude
//Passes to CreateCircleMarker function above
function chooseColor(mag) {
  // console.log(mag)
  switch(true) {
      //case (0 <= mag && mag < 1.0):
        //return "#aliceblue";
      case (1.0 <= mag && mag <= 2.5):
        return "#0000cc"; //blue
      case (2.5 <= mag && mag <= 4.0):
        return "#00cc00"; //green
      case (4.0 <= mag && mag <= 5.5):
        return "#ffff00"; //yellow
      case (5.5 <= mag && mag <= 7.0):
        return "#ff6600"; //orange
      case (7.0 <= mag && mag <= 15.0):
        return "#ff0000"; //red
      default:
        return "#660066"; //purple
  }
}

function createMap(earthquakes) {

  // Define outdoors and lightmap layers
  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Outdoors Map": outdoorsmap,
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      39.8282, -98.5795
    ],
    zoom: 4,
    layers: [outdoorsmap, earthquakes]
  });


}