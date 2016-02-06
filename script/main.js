$(document).ready(function(){
	var c = $("#canvas").get(0);
	var ctx = c.getContext("2d");
	
	var untouched = true;
	
	// mouseover canvas
	$("#canvas").mouseover(function(){
		if(untouched){
			ctx.clearRect(0, 0, c.width, c.height);
			untouched = false;
		}
	});
	
	if(untouched){
		// add instruction rect to canvas
		//rectangle base
		ctx.fillStyle = "#000000";
		ctx.fillRect(387, 195, 250, 40);
		
		//text
		ctx.textAlign = "center";
		ctx.fillStyle = "#EFDFAF";
		ctx.font = "24px Times New Roman";
		ctx.fillText("your mouse goes here", 512, 220);
	}
	
});