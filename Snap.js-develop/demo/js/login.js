/* Login script
	Comp 307 Project
	@author Yanis
*/

$(document).ready(function(){
	//hide password reset button initially
	$("#passwordreset").hide();

	var user = Parse.User.current();
	if(user != null){
		$("#username").text(user.get("username"));
		$('#showLogin').text("Log Out");
		$("#passwordreset").show();
	}
	
	$('#showLogin').on('click', function(e) {
		var currentUser = Parse.User.current();
		if(currentUser == null) {
			$('#loginModal').modal('show');
		}
		else {
			//user logs out
			Parse.User.logOut();
			//notify user
			$("#generalModalContent").html("<p><h4>Successfully logged out.</h4></p>");
			$("#generalModal").modal("show");
			
			$("#username").text("Guest");
			$('#showLogin').text("Login/Sign up");
			$("#passwordreset").hide();
		}
	});

	$('#signinform').submit(function () {
		 //validate sign in
		processLogin($("#userid").val(),
				$("#passwordinput").val());
		return false;
	
	});
	
	$("#passwordreset").on('click', function(e) {
		var currentUser = Parse.User.current();
		var email = currentUser.get("email");
		Parse.User.requestPasswordReset(email, {
			  success: function() {
				//notify user
				$("#generalModalContent").html("<p><h4>Successfully sent a reset password email!</h4></p>");
				$("#generalModal").modal("show");
			  },
			  error: function(error) {
			    // Show the error message
				$("#generalModalContent").html("<p><h4>Error: "+error.message+"</h4></p>");
				$("#generalModal").modal("show");
			  }
		});

	});

	$('#signupform').submit(function () {
		//validate signup
		$('#signupform').validate({
        rules: {
            Email: {
                required: true,
                email: true
            },
            newuserid: {
                required: true
            },
            newpassword: {
                required: true,
                rangelength: [1,8]
            },
            reenterpassword: {
                required: true,
                equalTo: "#newpassword",
            }
        },
        messages: {
        	Email : "Please enter a valid email",
        	newpassword : {
        		rangelength : "The password must have more than 1 and less than 8 characters"
        	},
        	reenterpassword : {
        		equalTo : "Must be the same password"
        	}
        },

		submitHandler: function(form, validator) {
			createUser($("#Email").val(),
					$("#newuserid").val(),
					$("#newpassword").val());
		    
		}
    	});

		return false;
	});
	
	
});

function createUser(email, name, password) {
	var user = new Parse.User();
	user.set("username", name);
	user.set("password", password);
	user.set("email", email);

	// other fields?
	var result;
	user.signUp(null, {
	  success: function(user) {
		//notify user
		$("#generalModalContent").html("<p><h4>Successfully signed up</h4></p>");
		$("#generalModal").modal("show");
		$('#loginModal').modal('hide');
	  },
	  error: function(user, error) {
	    // Show the error message somewhere
		$("#generalModalContent").html("<p><h4>Error: "+error.message+"</h4></p>");
		$("#generalModal").modal("show");
	  }
	});
}

function processLogin(name, password) {
	Parse.User.logIn(name, password, {
		  success: function(user) {
			  //notify user
			  $("#generalModalContent").html("<p><h4>Successfully logged in!</h4></p>");
			  $("#generalModal").modal("show");
			  $("#username").text(name);
			  $('#loginModal').modal('hide');
			  $('#showLogin').text("Log Out");
			  $("#passwordreset").show();
		  },
		  error: function(user, error) {
			  $("#generalModalContent").html("<p><h4>Error: "+error.message+"</h4></p>");
			  $("#generalModal").modal("show");
		  }
		});
}