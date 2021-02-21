// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 10,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    43.58, -79.64
  ],
  zoom: 5,

});

streetmap.addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    
    function mapStyle(feature) {
        return {
        opacity: 0.1,
        fillOpacity: 0.7,
        fillColor: mapColor(feature.properties.mag),
        color: 'white',
        radius: mapRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
        };
    }
    
    function mapColor(mag) {
        return mag > 5 ? '#800026':
                mag > 4 ? '#BD0026':
                mag > 3 ? '#E31A1C':
                mag > 2 ? '#FC4E2A':
                mag > 1 ? '#FD8D3C':
                        '#FED976';   
    } 

    function mapRadius(mag) {
        if (mag === 0) {
        return 1;
        }

        return mag * 5;
    }


    L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },

        style: mapStyle,

        onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

        }
    }).addTo(myMap);

    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0, 1, 2, 3, 4, 5];
        var labels  = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + mapColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap)
    
});

