// canvas module
var canvasControl = function() {
	var c = $("#canvas").get(0);
	var ctx = c.getContext("2d");
	var untouched = true;
	var content = null;
	var redrawIntervalId = null;
	var loadingImage = new Image();
	var loading = false;
	var loadingRotation = 1;
	
	// init
	loadingImage.src = "images/loading.svg";
	
	$("#canvas").mousemove(function(e){
		onMouseMove(e);
	});
	
	// private methods
	var clearCanvas = function() {
		ctx.clearRect(0, 0, c.width, c.height);
	};
	
	var drawInstruction = function() {
		//wheat border
		ctx.fillStyle = "#EFDFAF";
		ctx.fillRect((c.width/2) - 116, (c.height/2) - 84, 232, 42);
		
		//rectangle base
		ctx.fillStyle = "#000000";
		ctx.fillRect((c.width/2) - 115, (c.height/2) - 83, 230, 40);
		
		//text
		ctx.textAlign = "center";
		ctx.fillStyle = "#EFDFAF";
		ctx.font = "24px Times New Roman";
		ctx.fillText("your mouse goes here", (c.width/2), (c.height/2) - 58);
	};
	
	var drawLoadingImage = function() {
		ctx.translate(c.width / 2, c.height / 2);
		ctx.rotate((2 * Math.PI / 180) * loadingRotation);
		ctx.drawImage(loadingImage, - 30, - 30, 60, 60);
		ctx.rotate(-((2 * Math.PI / 180) * loadingRotation));
		ctx.translate(-(c.width / 2), -(c.height / 2));
		
		loadingRotation++;
	};
	
	var redraw = function() {
		clearCanvas();
		
		// draw images in correct order
		if(content !== null){
			for(var i = 1; i < tools.getObjectSize(content.images) + 1; i++){
				var image = content.images["layer" + i];
				ctx.drawImage(image.imageObj, image.x - (image.imageObj.width/2), image.y - (image.imageObj.height/2));
			}
		}
		
		// show instruction
		if(untouched){
			drawInstruction();
		}
		
		// show loading animation
		if(loading){
			drawLoadingImage();
		}
	};
	
	var onMouseMove = function(e){
		untouched = false;
		
			if(content !== null){
			// get mouse position relative to canvas
			var mousePosition = tools.getCanvasRelativePosition(c, e.clientX, e.clientY);
			
			//convert to central coordinate system
			mousePosition.x -= c.width / 2;
			mousePosition.y -= c.height / 2;
			
			// update image positions
			for(var key in content.images){
				content.images[key].x = (-mousePosition.x * content.images[key].factor) + c.width / 2;
				content.images[key].y = (-mousePosition.y * content.images[key].factor) + c.height / 2;
			}
		}
	};
	
	var findLargestImage = function() {
		var largestImage = null;
		var prevSurface = 0;
		
		// front to back
		for(var i = tools.getObjectSize(content.images); i > 0; i--){
			var img = content.images["layer" + i].imageObj;
			var surface = img.width * img.height;
			
			if(surface > prevSurface){
				prevSurface = surface;
				largestImage = content.images["layer" + i];
			}
		}
		
		return largestImage;
	};
	
	// public methods
	return {
		
		getContent: function() { return content; },
		
		setContent: function(cn, callback) {
			content = cn;
			
			// set canvas size
			canvasControl.setCanvasSize(content.width, content.height);
			
			// set initial image positions relative to canvas
			for(var i = 1; i < tools.getObjectSize(content.images) + 1; i++){
				content.images["layer" + i].x = c.width / 2;
				content.images["layer" + i].y = c.height / 2;
			}
			
			if(typeof(callback) == "function"){
				callback();
			}
		},
		
		beginDrawLoop: function() {
			redrawIntervalId = setInterval(redraw, 10);
		},
		
		stopDrawLoop: function() {
			if(redrawIntervalId != null){
				clearInterval(redrawIntervalId);
			}
		},
		
		showLoadingAnimation: function() {
			loading = true;
			loadingRotation = 1;
		},
		
		hideLoadingAnimation: function() {
			loading = false;
		},
		
		setCanvasSize: function(width, height) {
			if(width == null || height == null){
				// set canvas size to fit largest image
				
				// find largest image
				var largestImage = findLargestImage(content.images);
				
				// set canvas size considering the maneuver space
				c.width = largestImage.imageObj.width / (1 + largestImage.factor);
				c.height = largestImage.imageObj.height / (1 + largestImage.factor);
			}
			else{
				// validate
				if(width < settings.minimumCanvasWidth || width > settings.maximumCanvasWidth){
					width = settings.defaultCanvasWidth;
				}
				
				if(height < settings.minimumCanvasHeight || height > settings.maximumCanvasHeight){
					height = settings.defaultCanvasHeight;
				}
				
				// set canvas size as provided
				c.width = width;
				c.height = height;
			}
			
			// update image positions
			if(content !== null){
				for(var i = 1; i < tools.getObjectSize(content.images) + 1; i++){
					content.images["layer" + i].x = c.width / 2;
					content.images["layer" + i].y = c.height / 2;
				}
			}
		}
	};
}();