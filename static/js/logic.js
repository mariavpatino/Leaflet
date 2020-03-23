// MarkerColor
var colors = "";
function markerColor(feature) {
  if (feature.properties.mag <= 1) {
    return colors = "#8fe38f";
  }
  else if (feature.properties.mag <= 2) {
    return colors = "#deff9c";
  }
  else if (feature.properties.mag <= 3) {
    return colors = "#ffffc2";
  }
  else if (feature.properties.mag <= 4) {
    return colors = "#ffdebd";
  }
  else if (feature.properties.mag <= 5) {
    return colors = "#ff9e6e";
  }
  else {
    return colors = "#ff6262";
  }
}

// Marker size
function markerSize(feature) {
  return (feature.properties.mag) * 3.5;
}

// Base layers 
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

// baseMaps
var baseMaps = {
  "Satellite": satelliteMap,
  "Grayscale": lightMap,
  "Outdoors": outdoorsMap
};

// Store API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Request to the query URL
d3.json(queryUrl, function (data) {

  // Earthquake layer
  var earthquakes = L.geoJSON(data, {

    // circle markers
    pointToLayer: function (feature, latlng) {
      var earthquakeMarker = {
        stroke: false,
        radius: markerSize(feature),
        fillColor: markerColor(feature),
        fillOpacity: 1
      };
      return L.circleMarker(latlng, earthquakeMarker);
    },

    // Popups
    onEachFeature: function (feature, layer) {
      return layer.bindPopup("<h3>Place: " + feature.properties.place +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p><hr><p>Time: " + new Date(feature.properties.time) +"</p>");
    }
  });


  // Our style object
  var mapStyle = {
      color: "orange",
      weight: 3
  };
  d3.json("PlatesData/PB2002_boundaries.json", function (data) {
      // Creating a geoJSON layer with the retrieved data
      L.geoJson(data, {
          // Passing in our style object
          style: mapStyle
      }).addTo(map);
  });



  // Create an overlay object
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Define a map object
  var map = L.map("map", {
    // US coordinates
    center: [37.09, -95.71],
    zoom: 3,
    layers: [satelliteMap, earthquakes]
  });

  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
});


//create the legend
function legendColor(magnitude) {
  if (magnitude < 1) {
      return "#8fe38f"
  }
  else if (magnitude < 2) {
      return "#deff9c"
  }
  else if (magnitude < 3) {
      return "#ffffc2"
  }
  else if (magnitude < 4) {
      return "#ffdebd"
  }
  else if (magnitude < 5) {
      return "#ff9e6e"
  }
  else {
      return "#ff6262"
  }
}


// var legend = L.control({ position: 'bottomright' });
var legend = L.control()
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        richterScale = [0,1,2,3,4,5],
        labels = [];
    div.innerHTML += "<h1>Richter Scale</h1>"
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < richterScale.length; i++) {
        div.innerHTML +=
            '<i style="background:' + legendColor(richterScale[i]) + '"></i> ' +
            richterScale[i] + (richterScale[i + 1] ? '&ndash;' + richterScale[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);