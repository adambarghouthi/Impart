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
		$("#username").text($("#userid").val());
		//send login information
	});

	$('#confirmsignup').on('click', function (e) {
		//send login information
	});
});