$(function() {
	// on click get map's coordinates
	var lat;
	var lng;
	var file;

	map.on('click', function(e) {
	   $('#myModal').modal('show'); 
	   lat = e.latlng.lat;
	   lng = e.latlng.lng;
	});

	// Set an event listener on the Choose File field.
	$('#fileselect').bind("change", function(e) {
	  var files = e.target.files || e.dataTransfer.files;
	  // Our file var now holds the selected file
	  file = files[0];
	});

	// This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
	$('#uploadButton').click(function() {
		if (file == null) {
			alert('NO FILE');
			return;
		}
		else {
			alert('Continues');
		}

		var post = Parse.Object.extend("Post");
		var geoPoint = new Parse.GeoPoint(lat, lng);
		var parseFile = new Parse.File("file", file);
		post.set("caption", document.getElementById("message-text").value);
		post.set("file", parseFile);
		post.set("geoPoint", geoPoint);
		//post.set("userID", currentUserID);

		post.save(null, {
			success: function(POST) {
				// Execute any logic that should take place after the object is saved.
				alert('New object created with objectId: ' + POST.id);
				$('#myModal').modal('hide'); 
		  	},
		  	error: function(POST, error) {
		   		// Execute any logic that should take place if the save fails.
		    	// error is a Parse.Error with an error code and message.
		    	alert('Failed to create new object, with error code: ' + error.message);
		  	}
		});
	});
});

