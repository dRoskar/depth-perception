// canvas module
var canvasControl = function() {
	var c = $("#canvas").get()[0];
	var ctx = c.getContext("2d");
	var untouched = true;
	var content = null;
	var redrawIntervalId = null;
	var loadingImage = new Image();
	var loading = false;
	var loadingRotation = 1;
	var reverseAutoSizeMode = false;
	var adjustMode = false;
	var mouseDown = false;
	var touchdownLocation = null;
	
	// init
	loadingImage.src = "images/loading.svg";
	
	$("#canvas").mousemove(function(e){
		onMouseMove(e);
	});
	
	$("#canvas").mousedown(function(e){
		if(e.which === 1){
			// get mouse position relative to canvas
			touchdownLocation = tools.getCanvasRelativePosition(c, e.clientX, e.clientY);
			
			//convert to central coordinate system
			touchdownLocation.x -= c.width / 2;
			touchdownLocation.y -= c.height / 2;
			
			mouseDown = true;
		}
	});
	
	$("#canvas").mouseup(function(e){
		if(e.which === 1){
			mouseDown = false;

			// get mouse position
			var mousePosition = tools.getCanvasRelativePosition(c, e.clientX, e.clientY);
			
			//convert to central coordinate system
			mousePosition.x -= c.width / 2;
			mousePosition.y -= c.height / 2;
			
			// update selected images' offset
			for(var i = 1; i < (tools.getObjectSize(content.images) + 1); i++){
				if($("#adjust" + i + "Button").hasClass("toggled")){
					content.images["layer" + i].offsetX = content.images["layer" + i].offsetX + (mousePosition.x - touchdownLocation.x);
					content.images["layer" + i].offsetY = content.images["layer" + i].offsetY + (mousePosition.y - touchdownLocation.y);
				}
			}
			
			resetImagePositions();
		}
	});
	
	$("#canvas").mouseleave(function(e){
		if(mouseDown){
			// left canvas while adjusting images
			mouseDown = false;
			
			// get mouse position
			var mousePosition = tools.getCanvasRelativePosition(c, e.clientX, e.clientY);
			
			//convert to central coordinate system
			mousePosition.x -= c.width / 2;
			mousePosition.y -= c.height / 2;
			
			// update selected images' offset
			for(var i = 1; i < (tools.getObjectSize(content.images) + 1); i++){
				if($("#adjust" + i + "Button").hasClass("toggled")){
					content.images["layer" + i].offsetX = content.images["layer" + i].offsetX + (mousePosition.x - touchdownLocation.x);
					content.images["layer" + i].offsetY = content.images["layer" + i].offsetY + (mousePosition.y - touchdownLocation.y);
				}
			}
			
			resetImagePositions();
		}
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
				ctx.drawImage(image.imageObj, image.x - (image.imageObj.width/2) + image.offsetX, image.y - (image.imageObj.height/2) + image.offsetY);
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
			
			if(!adjustMode){
				// update image positions
				for(var key in content.images){
					content.images[key].x = (-mousePosition.x * content.images[key].factor) + c.width / 2;
					content.images[key].y = (-mousePosition.y * content.images[key].factor) + c.height / 2;
				}
			}
			else{
				// adjust mode - see if left mouse button is being held
				if(mouseDown){
					// update selected image positions
					for(var i = 1; i < (tools.getObjectSize(content.images) + 1); i++){
						if($("#adjust" + i + "Button").hasClass("toggled")){
							content.images["layer" + i].x = (c.width / 2) + mousePosition.x - touchdownLocation.x;
							content.images["layer" + i].y = (c.height / 2 ) + mousePosition.y - touchdownLocation.y;
						}
					}
				}
			}
		}
	};
	
	var findLargestImage = function() {
		var largestImage = null;
		var prevSurface = 0;
		
		if(reverseAutoSizeMode){
			// back to front
			for(var i = 1; i < (tools.getObjectSize(content.images) + 1); i++){
				var img = content.images["layer" + i].imageObj;
				var surface = img.width * img.height;
				
				if(surface > prevSurface){
					prevSurface = surface;
					largestImage = content.images["layer" + i];
				}
			}
		}
		else{
			// front to back
			for(var i = tools.getObjectSize(content.images); i > 0; i--){
				var img = content.images["layer" + i].imageObj;
				var surface = img.width * img.height;
				
				if(surface > prevSurface){
					prevSurface = surface;
					largestImage = content.images["layer" + i];
				}
			}
		}
		
		return largestImage;
	};
	
	var resetImagePositions = function(){
		if(content !== null){
			for(var i = 1; i < tools.getObjectSize(content.images) + 1; i++){
				content.images["layer" + i].x = c.width / 2;
				content.images["layer" + i].y = c.height / 2;
			}
		}
	}
	
	// public methods
	return {
		
		getReverseAutoSizeMode: function() { return reverseAutoSizeMode; },
		
		getContent: function() { return content; },
		
		setReverseAutoSizeMode: function(isReverse) { reverseAutoSizeMode = isReverse; },
		
		enableAdjustMode: function () {
			adjustMode = true;
			resetImagePositions();
		},
		
		disableAdjustMode: function () { adjustMode = false; },
		
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
				
				// calculate canvas size considering the maneuver space
				var calculatedWidth = largestImage.imageObj.width / (1 + largestImage.factor);
				var calculatedHeight = largestImage.imageObj.height / (1 + largestImage.factor);
				
				// don't suprass size limits
				calculatedWidth = calculatedWidth < settings.minimumCanvasWidth ? settings.minimumCanvasWidth : calculatedWidth;
				calculatedWidth = calculatedWidth > settings.maximumCanvasWidth ? settings.maximumCanvasWidth : calculatedWidth;
				
				calculatedHeight = calculatedHeight < settings.minimumCanvasHeight ? settings.minimumCanvasHeight : calculatedHeight;
				calculatedHeight = calculatedHeight > settings.maximumCanvasHeight ? settings.maximumCanvasHeight : calculatedHeight;
				
				// set canvas size
				c.width = calculatedWidth;
				c.height = calculatedHeight;
				
				// sync with content size
				if(content !== null){
					content.width = c.width;
					content.height = c.height;
				}
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
				
				// sync with content size
				if(content !== null){
					content.width = c.width;
					content.height = c.height;
				}
			}
			
			// reset image positions
			resetImagePositions();
		}
	};
}();