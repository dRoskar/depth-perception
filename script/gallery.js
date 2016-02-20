 var c = null;
 var ctx = null;
 var content = null;
 var contentCopy = null;
 var untouched = true;
 var loadedCount = 0;
 var page = "";
 var redrawIntervalId = null;
 var loadingIntervalId = null;
 var loading = false;
 var loadingRotation = 1;
 var keyIsDown = false;
 
$(document).ready(function(){
	c = $("#canvas").get(0);
	ctx = c.getContext("2d");
	
	// get url page parameter
	var params = getUrlParams();
	
	// get canvas contents
	loading = true;
	showLoadingAnimation();
	
	dataAccess.loadContent(params.i, null, imagesLoaded);
});

function imagesLoaded(){
	content = dataAccess.getContent();
	
	// copy content
	contentCopy = content;
	
	showInfo(content);
	
	loading = false;
	
	hideLoadingAnimation();
	
	// set canvas size
	if(content.width == null || content.height == null){
		// set canvas size to fit largest image
		
		// find largest image
		var largestImage = getLargestImage(content.images);
		
		// set canvas size considering the maneuver space
		c.width = largestImage.imageObj.width / (1 + largestImage.factor);
		c.height = largestImage.imageObj.height / (1 + largestImage.factor);
	}
	else{
		// set canvas size as provided
		c.width = content.width;
		c.height = content.height;
	}
	
	// set initial image positions relative to canvas
	for(var i = 1; i < getObjectSize(content.images) + 1; i++){
		content.images["layer" + i].x = c.width / 2;
		content.images["layer" + i].y = c.height / 2;
	}
	
	// begin redraw loop
	redrawIntervalId = setInterval(redraw, 10);
	
	// start monitoring mouse over canvas
	$("#canvas").mousemove(function(e){
		glide(e);
	});
}

function showInfo(content){
	// display image info
	$("#title").html(content.title);
	$("#author").html(content.author);
	
	// supply direct link url
	$("#textBoxShare").val(getUrlWithoutParameters() + "?i=" + content.hash);
}

function redraw(){
	// clear canvas
	ctx.clearRect(0, 0, c.width, c.height);
	
	// draw images in correct order
	for(var i = 1; i < getObjectSize(content.images) + 1; i++){
		var image = content.images["layer" + i];
		ctx.drawImage(image.imageObj, image.x - (image.imageObj.width/2), image.y - (image.imageObj.height/2));
	}
	
	// show instruction
	if(untouched){
		// add instruction rect to canvas
		drawInstructionalRect();
	}
};

function glide(e){
	untouched = false;
	
	// update image coordinates
	var mousePosition = getCanvasRelevantPosition(canvas, e.clientX, e.clientY);
	
	//convert to central coord sys
	mousePosition.x -= c.width / 2;
	mousePosition.y -= c.height / 2;
	
	// update image positions
	for(var key in content.images){
		content.images[key].x = (-mousePosition.x * content.images[key].factor) + c.width / 2;
		content.images[key].y = (-mousePosition.y * content.images[key].factor) + c.height / 2;
	}
};

function showLoadingAnimation(){
	var loadingImg = new Image();
	
	loadingImg.onload = function(){
		loadingIntervalId = setInterval(function(){
			drawLoadingImage(loadingImg);
		}, 10);
	}
	
	loadingImg.src = "images/loading.svg";
}

function hideLoadingAnimation(){
	clearInterval(loadingIntervalId);
	loadingRotation = 1;
}

function drawLoadingImage(loadingImg){
	// clear canvas
	ctx.clearRect(0, 0, c.width, c.height);
	
	// draw images in correct order
	if(contentCopy != null){
		for(var i = 1; i < 11; i++){
			var image = contentCopy.images["layer" + i];
			ctx.drawImage(image.imageObj, image.x - (image.imageObj.width/2), image.y - (image.imageObj.height/2));
		}
	}
	
	// show instruction
	if(untouched){
		// add instruction rect to canvas
		drawInstructionalRect();
	}
	
	// draw loading animation
	ctx.translate(c.width / 2, c.height / 2);
	ctx.rotate((2 * Math.PI / 180) * loadingRotation);
	ctx.drawImage(loadingImg, - 30, - 30, 60, 60);
	ctx.rotate(-((2 * Math.PI / 180) * loadingRotation));
	ctx.translate(-(c.width / 2), -(c.height / 2));
	
	loadingRotation++;
}

//----------------- buttons -----------------
$("#AL").click(function(){
	// next page
	if(!loading){
		// clear old redraw interval
		if(redrawIntervalId != null){
			clearInterval(redrawIntervalId);
		}
		
		loading = true;
		showLoadingAnimation();
		
		dataAccess.loadContent(content.hash, "next", imagesLoaded);
	}
});

$("#AR").click(function(){
	// prev page
	if(!loading){
		// clear old redraw interval
		if(redrawIntervalId != null){
			clearInterval(redrawIntervalId);
		}
		
		loading = true;
		showLoadingAnimation();
		
		dataAccess.loadContent(content.hash, "previous", imagesLoaded);
	}
});

$("#copyButton").click(function(){
	// select texbox value
	$("#textBoxShare").select();
	
	// copy selection text to clipboard
	document.execCommand("copy");
	
	// lose textbox focus (unselect text)
	$("#textBoxShare").blur();
});

$("#submitButton").click(function(){
	window.location.href = "submit.html";
});

$("#contactButton").click(function(){
	window.location.href = "contact.html";
});

// --------------- arrow keys ---------------
$(document).keydown(function(e){
	if(!keyIsDown){
		if(e.keyCode == 37){
			 keyIsDown = true;
			
			// left arrow
			if(!loading){
				// clear old redraw interval
				if(redrawIntervalId != null){
					clearInterval(redrawIntervalId);
				}
				
				loading = true;
				showLoadingAnimation();
				
				dataAccess.loadContent(content.hash, "next", imagesLoaded);
			}
		}
		else if(e.keyCode == 39){
			keyIsDown = true;
			
			// right arrow
			if(!loading){
				// clear old redraw interval
				if(redrawIntervalId != null){
					clearInterval(redrawIntervalId);
				}
				
				loading = true;
				showLoadingAnimation();
				
				dataAccess.loadContent(content.hash, "previous", imagesLoaded);
			}
		}
	}
});

$(document).keyup(function(e){
	if(e.keyCode == 37 || e.keyCode == 39){
		 keyIsDown = false;
	}
});

// ----------------- tools -----------------
function getCanvasRelevantPosition(canvas, x, y){
	var rect = canvas.getBoundingClientRect();
	
	return {x: x - rect.left, y: y - rect.top};
};

function drawInstructionalRect(){
	//wheat border
	ctx.fillStyle = "#EFDFAF";
	ctx.fillRect((c.width/2) - 126, (c.height/2) - 94, 252, 42);
	
	//rectangle base
	ctx.fillStyle = "#000000";
	ctx.fillRect((c.width/2) - 125, (c.height/2) - 93, 250, 40);
	
	//text
	ctx.textAlign = "center";
	ctx.fillStyle = "#EFDFAF";
	ctx.font = "24px Times New Roman";
	ctx.fillText("your mouse goes here", (c.width/2), (c.height/2) - 68);
}

function getUrlParams() {
	var params = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		params[key] = value;
	});
	
	return params;
}

function getUrlWithoutParameters(){
	var url = window.location.href;
	if(window.location.href.indexOf("?") > 0){
		return window.location.href.substring(0, window.location.href.indexOf("?"));
	}
	
	return window.location.href;
}

function getObjectSize(object){
	var count = 0;
	
	for(var key in object){
		if(object.hasOwnProperty(key)){
			count++;
		}
	}
	
	return count;
}

function getLargestImage(images){
	var largestImage = null;
	var prevSurface = 0;
	
	// front to back
	for(var i = getObjectSize(images); i > 0; i--){
		var img = images["layer" + i].imageObj;
		var surface = img.width * img.height;
		
		if(surface > prevSurface){
			prevSurface = surface;
			largestImage = images["layer" + i];
		}
	}
	
	return largestImage;
}