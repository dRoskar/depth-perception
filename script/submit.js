$(document).ready(function() {
	// begin canvas drawing loop
	canvasControl.beginDrawLoop();
	
	// show loading animation
	canvasControl.showLoadingAnimation();
	
	// get canvas contents
	dataAccess.loadContent("3x4mpl3", null, imagesLoaded);
});

function imagesLoaded(content) {
	// feed content to the canvas module
	canvasControl.setContent(content);
	
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
		
		// hide custom size input fields
		$("#customSizeInput").slideUp();
	}
});

$("#autoButton").click(function(){
	if(!$(this).hasClass("toggled")){
		// toggle button
		$(this).addClass("toggled");
		
		// untoggle other buttons
		$("#defaultButton").removeClass("toggled");
		$("#customButton").removeClass("toggled");
		
		// hide custom size input fields
		$("#customSizeInput").slideUp();
	}
});

$("#customButton").click(function(){
	if(!$(this).hasClass("toggled")){
		// toggle button
		$(this).addClass("toggled");
		
		// show custom size input fields
		$("#customSizeInput").slideDown();
		
		// untoggle other buttons
		$("#autoButton").removeClass("toggled");
		$("#defaultButton").removeClass("toggled");
	}
});

$("#testButton").click(function(){
	// collect image urls
	var empty = true;
	var imageUrls = [];
	
	for(var i = 1; i < 11; i++){
		var url = $("#l" + i + "tb").val();
		
		if(url !== ""){
			empty = false;
			
			imageUrls.push(url);
		}
		else{
			imageUrls.push(null);
		}
	}
	
	if(!empty){
		// package content
		var content = dataAccess.packageLocalContent("", "", imageUrls, 1024, 576);
		
		if(content !== false){
			// prepare content
			dataAccess.prepareContent(content, imagesLoaded);
		}
	}
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