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
$("#defaultButton").click(function(){
	if(!$(this).hasClass("toggled")){
		// toggle button
		$(this).addClass("toggled");
		
		// untoggle other buttons
		$("#autoButton").removeClass("toggled");
		$("#customButton").removeClass("toggled");
	}
});

$("#autoButton").click(function(){
	if(!$(this).hasClass("toggled")){
		// toggle button
		$(this).addClass("toggled");
		
		// untoggle other buttons
		$("#defaultButton").removeClass("toggled");
		$("#customButton").removeClass("toggled");
	}
});

$("#customButton").click(function(){
	if(!$(this).hasClass("toggled")){
		// toggle button
		$(this).addClass("toggled");
		
		// untoggle other buttons
		$("#autoButton").removeClass("toggled");
		$("#defaultButton").removeClass("toggled");
	}
});

$("#testButton").click(function(){
});

$("#adjustButton").click(function(){
	if(!$(this).hasClass("toggled")){
		// toggle button
		$(this).addClass("toggled");
	}
	else{
		$(this).removeClass("toggled");
	}
});

$("#submitButton").click(function(){
	
});

$("#galleryButton").click(function(){
	window.location.href = "/depth_perception";
});

$("#contactButton").click(function(){
	window.location.href = "contact.html";
});