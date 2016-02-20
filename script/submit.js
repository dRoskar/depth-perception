$(document).ready(function() {
	// begin canvas drawing loop
	canvasControl.beginDrawLoop();
	
	// show loading animation
	canvasControl.showLoadingAnimation();
	
	// get canvas contents
	dataAccess.loadContent("3x4mpl3", null, imagesLoaded);
});

function imagesLoaded() {
	// feed content to the canvas module
	canvasControl.setContent(dataAccess.getContent());
	
	// hide loading animation
	canvasControl.hideLoadingAnimation();
}

//----------------- buttons -----------------
$("#galleryButton").click(function(){
	window.location.href = "/depth_perception";
});

$("#contactButton").click(function(){
	window.location.href = "contact.html";
});