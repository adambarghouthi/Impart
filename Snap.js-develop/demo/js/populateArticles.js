
var minZoomBeforeError = 3; // check to see if we should change default zoom level
var maxArticlesShown = 100;
var currentMarkers = [];

//populate articles (dummmy parameter   )
repopulateArticles(5);

//query data base for 100 highest rated articles again after moving or zooming
map.on('zoomend', repopulateArticles);
map.on('moveend', repopulateArticles);


function repopulateArticles(e){

    //remove all markers
    for (var i = currentMarkers.length - 1; i >= 0; i--) {
        map.removeLayer(currentMarkers[i]);
    };

    //reset array
    currentMarkers = [];

    //get bounds on the zoomed rectangular area
    var zoomRectangle = map.getBounds();
    var southwest_lng = zoomRectangle.getSouthWest().lng;
    var southwest_lat = zoomRectangle.getSouthWest().lat;
    var northeast_lng = zoomRectangle.getNorthEast().lng;
    var northeast_lat = zoomRectangle.getNorthEast().lat;

    //create the geo points
    var sw = new Parse.GeoPoint(southwest_lat, southwest_lng);
    var ne = new Parse.GeoPoint(northeast_lat, northeast_lng);

    //query database
    var Post = Parse.Object.extend("Post");
    var query = new Parse.Query(Post);

    //get all articles within the visible area
    query.descending("rating").limit(maxArticlesShown);
    
    //not sure check this (we get error if we zoom out too much)
    if (!(map.getZoom() <= minZoomBeforeError))
        query.withinGeoBox("geoPoint", sw, ne);

    query.include("userID");
    //CHECK HERE FOR SELECTING SPORTS/POLITICS/ETC...
    //ADD LAST ADDED FILTER AS WELL
    //by country?
    //by continent?

    //find the objects
    query.find({
     success: function (results) {
         for (var i = 0; i < results.length; i++) {

             var object = results[i];

             //get object variables
             var point = object.get('geoPoint');
             var caption = object.get('caption');
             var file = object.get('file');
             var rating = object.get('rating');
             var userID = object.get('userID');
             var username = userID.get("username");
             var updateAt = object.get('updatedAt');
             var type = object.get('type');

             var Icon = null;
             switch(type)
             {
                case "technology": Icon = TechnologyIcon; break;
                case "culture": Icon = CultureIcon; break;
                case "politics": Icon = PoliticsIcon; break;
                case "sports": Icon = SportsIcon; break;
             }
  
             //add marker L.marker
             var marker = new L.marker([point.latitude, point.longitude],
                 {
                    icon :Icon
                 },
                 {
                    title: caption
                 });
             
             marker.fileUrl = file.url();
             marker.clicked = true;
             
             marker.addTo(map);
             marker.dragging.disable();
             marker.bindPopup("<b> " + caption + "</b><br> " + 
                              "<a target=\"_blank\" href=\"" + file.url() + "\"> See Article </a></br>" + 
                                rating + "</br>" 
                                + username + "</br>" 
                                + updateAt + "</br>",
                                {
                                    autopan:  false
                                });
             
             marker.on('mouseover', function(e)
             {
                this.openPopup();
             });

             marker.on('mouseout', function(e)
             {
                //if (!this.clicked)
                   // this.closePopup();
             });
             
             /*marker.on('click', function(e)
             {
                this.clicked = !this.clicked;
                if(this.clicked)
                    this.openPopup();
             });*/

             marker.on('dblclick', function(e)
             {

                //this.clicked = !this.clicked;
                openArticle(this.fileUrl);
             });

             //add marker to current markers
             currentMarkers.push(marker);
        }
     },
     error: function (error) {
         alert("Error: " + error.code + " " + error.message);
     }
  });
}

function openArticle(fileUrl)
{
   var win = window.open(fileUrl, '_blank');
   win.focus(); 
}

var PoliticsIcon = L.icon({
                                iconUrl: '../assets/politicsMarker.png', //CHANGE THIS
                                //shadowUrl: 'leaf-shadow.png',
                                iconSize:     [31, 41], // size of the icon
                                shadowSize:   [50, 64], // size of the shadow
                                iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
                                shadowAnchor: [4, 62],  // the same for the shadow
                                popupAnchor:  [3, -38] // point from which the popup should open relative to the iconAnchor
                            });
var SportsIcon = L.icon({
                                iconUrl: '../assets/sportsMarker.png', //CHANGE THIS
                                //shadowUrl: 'leaf-shadow.png',
                                iconSize:     [31, 41], // size of the icon
                                shadowSize:   [50, 64], // size of the shadow
                                iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
                                shadowAnchor: [4, 62],  // the same for the shadow
                                popupAnchor:  [3, -38] // point from which the popup should open relative to the iconAnchor
                            });

var CultureIcon = L.icon({
                                iconUrl: '../assets/cultureMarker.png', //CHANGE THIS
                                //shadowUrl: 'leaf-shadow.png',
                                iconSize:     [31, 41], // size of the icon
                                shadowSize:   [50, 64], // size of the shadow
                                iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
                                shadowAnchor: [4, 62],  // the same for the shadow
                                popupAnchor:  [3, -38] // point from which the popup should open relative to the iconAnchor
                            });
var TechnologyIcon = L.icon({
                                iconUrl: '../assets/technologyMarker.png', //CHANGE THIS
                                //shadowUrl: 'leaf-shadow.png',
                                iconSize:     [31, 41], // size of the icon
                                shadowSize:   [50, 64], // size of the shadow
                                iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
                                shadowAnchor: [4, 62],  // the same for the shadow
                                popupAnchor:  [3, -38] // point from which the popup should open relative to the iconAnchor
                            });