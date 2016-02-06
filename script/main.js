$(document).ready(function(){
	var c = $("#canvas").get(0);
	var ctx = c.getContext("2d");
	
	var untouched = true;
	
	// get canvas contents
	$.get("backend/getContent.php?p=", function(data){
		if(data == "false"){
			console.log("error fetching data");
		}
	});
	
	// mouse enter canvas
	$("#canvas").mouseover(function(){
		if(untouched){
			ctx.clearRect(0, 0, c.width, c.height);
			untouched = false;
		}
	});
	
	// mouse move over canvas
	$("#canvas").mouseover(function(){
		// get position
		
		// update values
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