 var c = null;
 var ctx = null;
 var content = null;
 var untouched = true;
 var loadedCount = 0;

$(document).ready(function(){
	c = $("#canvas").get(0);
	ctx = c.getContext("2d");
	
	// get canvas contents
	$.get("backend/getContent.php?p=", function(data){
		if(data == "false"){
			// error
		}
		else{
			loadedCount = 0;
			
			// save retrieved content
			data = JSON.parse(data);
			
			content = {
				title: data[1],
				author: (data[2] == "" || data[2] == null) ? "Anonymous" : data[2],
				images: {},
				limit: data[13] == "f" ? false : true,
				front_image: data[14],
				page: data[15]
			};
			
			for(var i = 1; i < 11; i++){
				content.images["layer" + i] = {
						url: data[i + 2] == null ? "images/empty.gif" : data[i + 2],
						imageObj: new Image(),
						x: settings.canvasWidth / 2,
						y: settings.canvasHeight / 2,
						factor: settings["layer" + i + "Factor"]
				};
			}
			
			// suppy source to image objects and wait for all images to load
			for(var key in content.images){
				var url = content.images[key].url;
				
				// notify onload
				content.images[key].imageObj.onload = function(){
					loadedCount++;
					
					if(loadedCount == 10){
						imagesLoaded();
					}
				}
				
				// set image src
				content.images[key].imageObj.src = url;
			}
		}
	});
});

function imagesLoaded(){
	// begin redraw loop
	setInterval(redraw, 10);
	
	// start monitoring mouse over canvas
	$("#canvas").mousemove(glide);
	
	// capture first touch
	$("#canvas").mouseover(function(){
		untouched = false;
	});
}

function redraw(){
	// clear canvas
	ctx.clearRect(0, 0, c.width, c.height);
	
	// draw images in correct order
	for(var i = 1; i < 11; i++){
		var image = content.images["layer" + i];
		ctx.drawImage(image.imageObj, image.x - (image.imageObj.width/2), image.y - (image.imageObj.height/2));
	}
	
	// show instruction
	if(untouched){
		// add instruction rect to canvas
		
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
};

function glide(){
	// update image coordinates
};