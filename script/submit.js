$(document).ready(function(){
	c = $("#canvas").get(0);
	ctx = c.getContext("2d");
	
	// get canvas contents
	dataAccess.loadContent("3x4mpl3", null);
});

//----------------- buttons -----------------
$("#galleryButton").click(function(){
	window.location.href = "/depth_perception";
});

$("#contactButton").click(function(){
	window.location.href = "contact.html";
});