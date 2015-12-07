
var minZoomBeforePost = 6;

//Parse.initialize("aJCIUPwri05ulLDusmNGLnajbiuXC1twyrIbkFXx", "ekuLhxWCFjIZ3JaIYvUFNR4xOPeijbuaAcBeJChh");

$(function() {
	// on click get map's coordinates
	var lat;
	var lng;
	var file;

	map.on('click', function(e) {
		if (!Parse.User.current()) {
			$("#generalModalContent").html("<p><h4>Please log in or sign up to post articles</h4></p>");
			$("#generalModal").modal("show");
			return;
		}
		else if (map.getZoom() < minZoomBeforePost) {
			$("#generalModalContent").html("<p><h4>Please zoom in " + (minZoomBeforePost - map.getZoom()) + " or more level(s) to specify a more precise location </h4></p>");
			$("#generalModal").modal("show");
			return;
		}
	   	$('#myModal').modal('show'); 
	   	lat = e.latlng.lat;
	   	lng = e.latlng.lng;
	});

	// This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('#fileselect').bind("change", function(e) {
      var files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      file = files[0];
    });

    // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('#uploadbutton').click(function() {

    	if (file == null) {
			$(".alert").show();
			return;
    	};

		var parseFile = new Parse.File("news", file);
		parseFile.save().then(function() {
		  	// The file has been saved to Parse.
		  	var postClass = Parse.Object.extend("Post");
    		var post = new postClass();
			var point = new Parse.GeoPoint({latitude: lat, longitude: lng});

			post.set("rating", 0);
			post.set("type", $("#selecttype option:selected").val());
			post.set("caption", CKEDITOR.instances.editor1.getData());
			post.set("geoPoint", point);
			post.set("file", parseFile);

			if (Parse.User.current()) {
				post.set("userID", Parse.User.current());
			};

			post.save();

			//hide pop up modal and refresh page
			$('#myModal').modal('hide');
			location.reload();
			
		}, function(error) {
		  	// The file either could not be read, or could not be saved to Parse.
		  	alert('Failed to save file, with error code: ' + error.message);
		});
	});
});

