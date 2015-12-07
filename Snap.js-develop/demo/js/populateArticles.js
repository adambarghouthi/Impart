var minZoomBeforeError = 3; // check to see if we should change default zoom level
var maxArticlesShown = 100;
var currentMarkers = [];

var politicsFilter = true;
var sportsFilter = true;
var cultureFilter = true;
var technologyFilter = true;
var allFilter = true;

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

    //get all articles with :
    //      1. with highest rating/views
    //      2. up to maxArtcilesShown
    //      3. include user information from userID such as username etc...
    query.descending("rating").limit(maxArticlesShown).include("userID");
    
    var containedIn = [];

    //check if we don't display everything
    if (!allFilter)
    {
        //check if we display political articles
        if (politicsFilter)
            containedIn.push("politics");

        //check if we display sports articles
        if (sportsFilter)
             containedIn.push("sports");

        //check if we display cultural articles
        if (cultureFilter)
          containedIn.push("culture");

        //check if we display technological articles    
        if (technologyFilter)
             containedIn.push("technology");

         query.containedIn("type", containedIn);
    }

    //not sure check this (we get error if we zoom out too much)
    if (!(map.getZoom() <= minZoomBeforeError))
        query.withinGeoBox("geoPoint", sw, ne);

    //CHECK HERE FOR SELECTING SPORTS/POLITICS/ETC...
    //ADD LAST ADDED FILTER AS WELL
    //by country?
    //by continent?
    var politicsCount = 0;
    var cultureCount = 0;
    var sportsCount = 0;
    var technologyCount = 0;

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
                case "technology": Icon = TechnologyIcon; technologyCount = technologyCount + 1; break;
                case "culture": Icon = CultureIcon; cultureCount = cultureCount + 1; break;
                case "politics": Icon = PoliticsIcon; politicsCount = politicsCount + 1; break;
                case "sports": Icon = SportsIcon; sportsCount = sportsCount + 1; break;
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
             marker.title = caption;   

             marker.addTo(map);
             marker.dragging.disable();
             marker.bindPopup("<b> " + caption + "</b><br> " + rating + " views</br>" 
                                + "<a href='#' onclick='window.location.replace(\"./profile.html?"+username+"\");'>"+username+"</a>" + "</br>" 
                                + updateAt + "</br>",
                                {
                                    autopan:  false
                                });
             //
             //<a href="javascript:void(0);" onclick="ShowOld(2367,146986,2);">
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
                openArticle(this.fileUrl, this.title);
             });

             //add marker to current markers
             currentMarkers.push(marker);
        }
        $("#politicsnb").text(politicsCount);
        $("#technologynb").text(technologyCount);
        $("#culturenb").text(cultureCount);
        $("#sportsnb").text(sportsCount);
     },
     error: function (error) {
         alert("Error: " + error.code + " " + error.message);
     }
  });

  
  //$("#totalnb").text((politicsCount + technologyCount + cultureCount + sportsCount));
}

function openArticle(fileUrl, caption) {
    //update view count
    var post = Parse.Object.extend("Post");
    var query = new Parse.Query(post);
    query.equalTo("caption", caption);
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          object.increment("rating");
          object.save();
        }
      },
      error: function(error) {
      }
    });

    $("#generalModalContent").html(caption + "<br><br>" + "<img class=\"img-responsive\" src=" + fileUrl + ">");
    $("#generalModal").modal("show");
}

var PoliticsIcon = L.icon({
                                iconUrl: '../assets/politicsMarker.png',
                                //shadowUrl: 'leaf-shadow.png',
                                iconSize:     [31, 41], // size of the icon
                                shadowSize:   [50, 64], // size of the shadow
                                iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
                                shadowAnchor: [4, 62],  // the same for the shadow
                                popupAnchor:  [3, -38] // point from which the popup should open relative to the iconAnchor
                            });
var SportsIcon = L.icon({
                                iconUrl: '../assets/sportsMarker.png',
                                //shadowUrl: 'leaf-shadow.png',
                                iconSize:     [31, 41], // size of the icon
                                shadowSize:   [50, 64], // size of the shadow
                                iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
                                shadowAnchor: [4, 62],  // the same for the shadow
                                popupAnchor:  [3, -38] // point from which the popup should open relative to the iconAnchor
                            });

var CultureIcon = L.icon({
                                iconUrl: '../assets/cultureMarker.png',
                                //shadowUrl: 'leaf-shadow.png',
                                iconSize:     [31, 41], // size of the icon
                                shadowSize:   [50, 64], // size of the shadow
                                iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
                                shadowAnchor: [4, 62],  // the same for the shadow
                                popupAnchor:  [3, -38] // point from which the popup should open relative to the iconAnchor
                            });
var TechnologyIcon = L.icon({
                                iconUrl: '../assets/technologyMarker.png',
                                //shadowUrl: 'leaf-shadow.png',
                                iconSize:     [31, 41], // size of the icon
                                shadowSize:   [50, 64], // size of the shadow
                                iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
                                shadowAnchor: [4, 62],  // the same for the shadow
                                popupAnchor:  [3, -38] // point from which the popup should open relative to the iconAnchor
                            });