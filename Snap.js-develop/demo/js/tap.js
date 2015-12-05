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

	// This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('#fileselect').bind("change", function(e) {
      var files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      file = files[0];
    });

    // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('#uploadbutton').click(function() {
      	var serverUrl = 'https://api.parse.com/1/files/' + file.name;

		$.ajax({
			type: "POST",
			beforeSend: function(request) {
				request.setRequestHeader("X-Parse-Application-Id", 'aJCIUPwri05ulLDusmNGLnajbiuXC1twyrIbkFXx');
				request.setRequestHeader("X-Parse-REST-API-Key", 'bEw5mEccrY8jXtgNvacbeWVWgFDC6qZB74oFoMhF');
				request.setRequestHeader("Content-Type", file.type);
			},

			url: serverUrl,
			data: file,
			processData: false,
			contentType: false,

			success: function(data) {
				alert("File available at: " + data.url);
			},
			error: function(data) {
				var obj = jQuery.parseJSON(data);
				alert(obj.error);
			}
		});
	});
});

