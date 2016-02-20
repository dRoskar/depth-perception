 var keyIsDown = false;
 
$(document).ready(function() {
	// get url page parameter
	var params = tools.getUrlParams();
	
	// begin canvas drawing loop
	canvasControl.beginDrawLoop();
	
	// show loading animation
	canvasControl.showLoadingAnimation();
	
	// get canvas contents
	dataAccess.loadContent(params.i, null, imagesLoaded);
});

function imagesLoaded() {
	// display content information under the canvas
	showInfo(dataAccess.getContent());
	
	// feed content to the canvas module
	canvasControl.setContent(dataAccess.getContent());
	
	// hide loading animation
	canvasControl.hideLoadingAnimation();
}

function showInfo(content) {
	// display image info
	$("#title").html(content.title);
	$("#author").html(content.author);
	
	// supply direct link url
	$("#textBoxShare").val(tools.getUrlWithoutParameters() + "?i=" + content.hash);
}

//----------------- buttons -----------------
$("#AL").click(function() {
	if(!dataAccess.isLoading()){
		// show loading animation
		canvasControl.showLoadingAnimation();
		
		// load next page
		dataAccess.loadContent(dataAccess.getContent().hash, "next", imagesLoaded);
	}
});

$("#AR").click(function() {
	if(!dataAccess.isLoading()){
		// show loading animation
		canvasControl.showLoadingAnimation();
		
		// load prev page
		dataAccess.loadContent(dataAccess.getContent().hash, "previous", imagesLoaded);
	}
});

$("#copyButton").click(function() {
	// select texbox value
	$("#textBoxShare").select();
	
	// copy selection text to clipboard
	document.execCommand("copy");
	
	// lose textbox focus (unselect text)
	$("#textBoxShare").blur();
});

$("#submitButton").click(function() {
	window.location.href = "submit.html";
});

$("#contactButton").click(function() {
	window.location.href = "contact.html";
});

// --------------- arrow keys ---------------
$(document).keydown(function(e) {
	if(!keyIsDown){
		if(e.keyCode == 37){
			 keyIsDown = true;
			
			// left arrow
			if(!dataAccess.isLoading()){
				// show loading animation
				canvasControl.showLoadingAnimation();
				
				// load next page
				dataAccess.loadContent(dataAccess.getContent().hash, "next", imagesLoaded);
			}
		}
		else if(e.keyCode == 39) {
			keyIsDown = true;
			
			// right arrow
			if(!dataAccess.isLoading()){
				// show loading animation
				canvasControl.showLoadingAnimation();
				
				// load prev page
				dataAccess.loadContent(dataAccess.getContent().hash, "previous", imagesLoaded);
			}
		}
	}
});

$(document).keyup(function(e) {
	if(e.keyCode == 37 || e.keyCode == 39){
		 keyIsDown = false;
	}
});
