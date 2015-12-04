/* Login script
	Comp 307 Project
	@author Yanis
*/

$(document).ready(function(){
	$('#showLogin').on('click', function(e) {
		$('#loginModal').modal('show');
		//document.getElementById("myModal").aria-hiddene;
	});

	$('#signin').on('click', function (e) {
		//validate signup


		$("#username").text($("#userid").val());
		//send login information
	});

	$('#confirmsignup').on('click', function (e) {
		//validate signup
		$('#signupform').validate({
        rules: {
            Email: {
                required: true,
                email: true,
                messages: {
                	email : "Please enter a valid email"
                }
            },
            newuserid: {
                required: true
            },
            newpassword: {
                required: true,
                minlength: 1,
                maxlength: 8,
                messages: {
                	minlength : "The password must have more than 1 character",
                	maxlength : "The password must have less than 8 character"
                }
            },
            reenterpassword: {
                required: true,
                equalTo: "#newpassword",
                messages: {
                	equalTo : "Must be the same password"
                }
            }
        }
    	});
		//send login information
	});
});