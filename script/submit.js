$(document).ready(function(){
	c = $("#canvas").get(0);
	ctx = c.getContext("2d");
	
	// get canvas contents
//	retrieveContent(params.i, null);
});

//----------------- buttons -----------------
$("#galleryButton").click(function(){
	console.log("suo");
	window.location.href = "/depth_perception";
});

$("#contactButton").click(function(){
	window.location.href = "contact.html";
});