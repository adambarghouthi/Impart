
//get articles
  var Post = Parse.Object.extend("Post");
  var queryObject = new Parse.Query(Post);
  queryObject.find({
     success: function (results) {
         for (var i = 0; i < results.length; i++) {
             var object = results[i];

             //get object variables
             var point = object.get('geoPoint');
             var caption = object.get('caption');
             var file = object.get('file');
             var rating = object.get('rating');
             var userID = object.get('userID');
             var updateAt = object.get('updatedAt');
            
             //add marker
             var marker = L.marker([point.latitude, point.longitude]).addTo(map);
             marker.dragging.disable();
             marker.bindPopup("<b> " + caption + "</b><br> " + "<a href=\"" + file.url() + "\"> see article </a></br>" + rating + "</br>" + userID.username + "</br>" + updateAt + "</br>");
             
             marker.on('click', function(e)
             {
             	marker.openPopup();
             });

             
        }
     },
     error: function (error) {
         alert("Error: " + error.code + " " + error.message);
     }
 });