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
 
$(document).ready(function(){
	c = $("#canvas").get(0);
	ctx = c.getContext("2d");
	
	// get url page parameter
	var params = getUrlParams();
	
	if(params.i == null){
		params.i = "";
	}
	
	// get canvas contents
	retrieveContent(params.i, null);
});

function retrieveContent(hash, nav){
	// clear old redraw interval
	if(redrawIntervalId != null){
		clearInterval(redrawIntervalId);
	}
	
	loading = true;
	
	showLoadingAnimation();
	
	if(nav == null){
		nav = "";
	}
	
	$.get("backend/getContent.php?i=" + hash + "&n=" + nav, function(data){
		if(data == "false"){
			// error
		}
		else{
			loadedCount = 0;
			
			// save retrieved content
			data = JSON.parse(data);
			
			if(!data.hasOwnProperty("error")){
				content = {
					title: data[1],
					author: (data[2] == "" || data[2] == null) ? "Anonymous" : data[2],
					images: {},
					hash: data[14],
					width: data[15],
					height: data[16]
				};
				
				for(var i = 1; i < 11; i++){
					content.images["layer" + i] = {
							url: data[i + 2] == null ? "images/empty.gif" : data[i + 2],
							imageObj: new Image(),
							x: c.width / 2,
							y: c.height / 2,
							factor: settings["layer" + i + "Factor"]
					};
				}
			}
			else{
				// get 404 images
				hideLoadingAnimation();
				retrieveContent("404", null);
				return;
			}
			
			page = content.page;
			
			// supply source to image objects and wait for all images to load
			for(var key in content.images){
				var url = content.images[key].url;
				
				// notify onload
				content.images[key].imageObj.onload = function(){
					loadedCount++;
					
					if(loadedCount == 10){
						imagesLoaded();
					}
				}
				
				// switch src to a local 404 image if images doesn't exist
				content.images[key].imageObj.onerror = function(){
					this.onerror = null;
					this.src = "images/localContent/missingImage.png";
				}
				
				// set image src
				content.images[key].imageObj.src = url;
			}
			
			// display image info
			$("#title").html(content.title);
			$("#author").html(content.author);
			
			// supply direct link url
			$("#textBoxShare").val(getUrlWithoutParameters() + "?i=" + content.hash);
		}
	});
}

function imagesLoaded(){
	//clone content
	contentCopy = content;
	
	loading = false;
	
	hideLoadingAnimation();
	
	// set canvas size
	c.width = content.width;
	c.height = content.height;
	
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
	mousePosition.x -= 512;
	mousePosition.y -= 288;
	
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
		retrieveContent(content.hash, "next");
	}
});

$("#AR").click(function(){
	// prev page
	if(!loading){
		retrieveContent(content.hash, "previous");
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

// --------------- keypress ---------------
$(document).keypress(function(e){
	if(e.keyCode == 37){
		// left arrow
		if(!loading){
			
			retrieveContent(content.hash, "next");
		}
	}
	else if(e.keyCode == 39){
		// right arrow
		if(!loading){
			retrieveContent(content.hash, "previous");
		}
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
	ctx.fillRect(386, 194, 252, 42);
	
	//rectangle base
	ctx.fillStyle = "#000000";
	ctx.fillRect(387, 195, 250, 40);
	
	//text
	ctx.textAlign = "center";
	ctx.fillStyle = "#EFDFAF";
	ctx.font = "24px Times New Roman";
	ctx.fillText("your mouse goes here", 512, 220);
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