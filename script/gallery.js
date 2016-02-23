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

function imagesLoaded(content) {
	// display content information under the canvas
	showInfo(content);
	
	// feed content to the canvas module
	canvasControl.setContent(content);
	
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
		dataAccess.loadContent(canvasControl.getContent().hash, "next", imagesLoaded);
	}
});

$("#AR").click(function() {
	if(!dataAccess.isLoading()){
		// show loading animation
		canvasControl.showLoadingAnimation();
		
		// load prev page
		dataAccess.loadContent(canvasControl.getContent().hash, "previous", imagesLoaded);
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
// left arrow key
keyboard.registerKeyDownAction(37, function() {
	if(!dataAccess.isLoading()){
		// show loading animation
		canvasControl.showLoadingAnimation();
		
		// load next page
		dataAccess.loadContent(canvasControl.getContent().hash, "next", imagesLoaded);
	}
});

// right arrow key
keyboard.registerKeyDownAction(39, function() {
	if(!dataAccess.isLoading()){
		// show loading animation
		canvasControl.showLoadingAnimation();
		
		// load previous page
		dataAccess.loadContent(canvasControl.getContent().hash, "previous", imagesLoaded);
	}
});
