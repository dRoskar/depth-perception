$(document).ready(function() {
	$("#sizeXTb").get()[0].previousValue = settings.defaultCanvasWidth;
	$("#sizeYTb").get()[0].previousValue = settings.defaultCanvasHeight;

	$("#sizeXTb").get()[0].maxValue = settings.maximumCanvasWidth;
	$("#sizeXTb").get()[0].minValue = settings.minimumCanvasWidth;
	$("#sizeYTb").get()[0].maxValue = settings.maximumCanvasHeight;
	$("#sizeYTb").get()[0].minValue = settings.minimumCanvasHeight;
	
	$("#sizeXTb").get()[0].valid = true;
	$("#sizeYTb").get()[0].valid = true;
	
	$("#canvas").get()[0].updateSizeTimeoutId = null;
	
	// custom tooltips
	var tooltip = $("#sizeXTb").qtip({
		id: "sizeXTooltip",
		content: {
			text: "",
			title: ""
		},
		style: {
			classes: "qtip-red qtip-custom"
		},
		position: {
			my: "top center",
			at: "bottom center",
			target: $("#sizeXTb")
		},
		show: {
			event: false,
			effect: function() {
				$(this).fadeIn("fast");
			}
		},
		hide: {
			event: false,
			effect: function() {
				$(this).fadeOut("fast");
			}
		}
	});
	
	$("#sizeYTb").qtip({
		id: "sizeYTooltip",
		content: {
			text: "",
			title: ""
		},
		style: {
			classes: "qtip-red qtip-custom"
		},
		position: {
			my: "top center",
			at: "bottom center",
			target: $("#sizeYTb")
		},
		show: {
			event: false,
			effect: function() {
				$(this).fadeIn("fast");
			}
		},
		hide: {
			event: false,
			effect: function() {
				$(this).fadeOut("fast");
			}
		}
	});
	
	// ----------------- buttons -----------------
	$("#defaultButton").click(function(){
		if(!$(this).hasClass("toggled")){
			// toggle button
			$(this).addClass("toggled");
			
			// untoggle other buttons
			$("#autoButton").removeClass("toggled");
			$("#customButton").removeClass("toggled");
			monitorInputFields(false);
			
			// hide custom size input fields
			$("#customSizeInput").slideUp();
			
			// update canvas size
			canvasControl.setCanvasSize(settings.defaultCanvasWidth, settings.defaultCanvasHeight);
		}
	});

	$("#autoButton").click(function(){
		if(!$(this).hasClass("toggled")){
			// toggle button
			$(this).addClass("toggled");
			
			// untoggle other buttons
			$("#defaultButton").removeClass("toggled");
			$("#customButton").removeClass("toggled");
			monitorInputFields(false);
			
			// hide custom size input fields
			$("#customSizeInput").slideUp();
			
			// update canvas size
			canvasControl.setCanvasSize(null, null);
		}
	});

	$("#customButton").click(function(){
		if(!$(this).hasClass("toggled")){
			// toggle button
			$(this).addClass("toggled");
			
			// show custom size input fields
			$("#customSizeInput").slideDown();
			
			// change canvas size
			canvasControl.setCanvasSize($("#sizeXTb").val(), $("#sizeYTb").val());
			
			// enable size input fields
			monitorInputFields(true);
			
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
		else{
			alert("Paste some image links to the input boxes first");
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
	// -------------------------------------------
	
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

// ----------- custom size inputs -----------
function monitorInputFields(on){
	if(on){
		$("#sizeXTb").on("input paste", onSizeInputChange);
		$("#sizeYTb").on("input paste", onSizeInputChange);
	}
	else{
		$("#sizeXTb").off("input paste", onSizeInputChange);
		$("#sizeYTb").off("input paste", onSizeInputChange);
	}
}

function onSizeInputChange(){
	// get tooltip api
	var tooltipApi = $("#" + this.id).qtip("api");
	
	// validate
	if(isNaN(this.value)){
		this.value = this.previousValue;
	}
	else{
		if(this.value < this.minValue){
			this.valid = false;
			
			// destory old unexecuted timers
			if($("#canvas").get()[0].updateSizeTimeoutId != null){
				clearTimeout($("#canvas").get()[0].updateSizeTimeoutId);
				$("#canvas").get()[0].updateSizeTimeoutId = null;
			}
			
			// update tooltip
			tooltipApi.set("content.title", "Too small!");
			
			if(this.id == "sizeXTb"){
				tooltipApi.set("content.text", "minimum: " + settings.minimumCanvasWidth);
			}
			else if(this.id == "sizeYTb"){
				tooltipApi.set("content.text", "minimum: " + settings.minimumCanvasHeight);
			}
			
			// show tooltip
			tooltipApi.show();
		}
		else if(this.value > this.maxValue){
			this.valid = false;
			
			// destory old unexecuted timers
			if($("#canvas").get()[0].updateSizeTimeoutId != null){
				clearTimeout($("#canvas").get()[0].updateSizeTimeoutId);
				$("#canvas").get()[0].updateSizeTimeoutId = null;
			}
			
			// update tooltip
			tooltipApi.set("content.title", "Too large!");

			if(this.id == "sizeXTb"){
				tooltipApi.set("content.text", "maximum: " + settings.maximumCanvasWidth);
			}
			else if(this.id == "sizeYTb"){
				tooltipApi.set("content.text", "maximum: " + settings.maximumCanvasHeight);
			}
			
			// show tooltip
			tooltipApi.show();
		}
		else{
			this.valid = true;
			
			// hide tooltip
			tooltipApi.hide();
			
			// if both values are valid, update canvas size
			if($("#sizeXTb").get()[0].valid && $("#sizeYTb").get()[0].valid){
				
				// destory old unexecuted timers
				if($("#canvas").get()[0].updateSizeTimeoutId != null){
					clearTimeout($("#canvas").get()[0].updateSizeTimeoutId);
					$("#canvas").get()[0].updateSizeTimeoutId = null;
				}
				
				var width = $("#sizeXTb").val();
				var height = $("#sizeYTb").val();
				$("#canvas").get()[0].updateSizeTimeoutId = setTimeout(function(){
					canvasControl.setCanvasSize(width, height);
				}, 500);
			}
		}
		
		this.previousValue = this.value;
	}
}
// ------------------------------------------