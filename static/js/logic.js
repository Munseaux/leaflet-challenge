function getColor(plop) {  //get a more palatble color range. 
    return plop >= 90 ? 'blue':
        plop >= 70 ? 'green':
        plop >= 50 ? 'yellow':
        plop >= 30 ? 'orange':
        plop >= 10 ? 'red':
        'purple';
}


var myMap = L.map("map", {
    center: [0, 0],
    zoom: 3
  });

  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var legend = L.control({ position: "bottomright" });


d3.json(url).then(data => {

    console.log(data);


    data.features.forEach(element => {
        var lon = element.geometry.coordinates[0];
        var lat = element.geometry.coordinates[1];
        var depth = element.geometry.coordinates[2];
        var mag = element.properties.mag;
        
        if (lon){
            var circle = L.circle([lat, lon], {
                color: getColor(depth),
                fillColor: getColor(depth),
                fillOpacity: .5,
                radius: mag * 50000
            }).addTo(myMap)
            circle.bindPopup(`<h3> ${element.properties.place}</h3> <p>Date and Time: ${new Date(element.properties.time)}</p>  <p>Depth ${depth}</p> <p>Latitude: ${lat} Longitude: ${lon}</p> 
                    <p>Magnitude: ${mag}</p>`); //TODO add more earthquake info 
        }
    });

    //   var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["90+","71-89", "51-70", "31-50", "11-30", "0-10"];
        var colors = ["blue", "green", "yellow", "orange", "red", "purple"];
        var labels = [];
    
        // Add min & max
        var legendInfo = "<div><h1 style=\"background-color: white\">Depth</h1>";
    
        div.innerHTML = legendInfo;
    
        limits.forEach(function(limit, index) {
          labels.push("<li id=\"leg-element\" style=\"background-color: " + colors[index] + "\">" + limit + "</li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul></div>";
        return div;
      };
  

    legend.addTo(myMap);
    //TODO make legend
    //TODO make sure that your API key is not publishable. 

});