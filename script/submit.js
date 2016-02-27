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
			
			// hide custom size tooltips
			$("#sizeXTb").qtip("api").hide();
			$("#sizeYTb").qtip("api").hide();
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
			
			// hide custom size tooltips
			$("#sizeXTb").qtip("api").hide();
			$("#sizeYTb").qtip("api").hide();
		}
	});

	$("#customButton").click(function(){
		if(!$(this).hasClass("toggled")){
			// toggle button
			$(this).addClass("toggled");
			
			// show custom size input fields
			$("#customSizeInput").slideDown();
			
			// change canvas size
			onSizeInputChange($("#sizeXTb").get()[0]);
			onSizeInputChange($("#sizeYTb").get()[0]);
			
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
			// remove invalid color from input box
			$("#l" + i + "tb").removeClass("invalid");
			
			// get input box value
			var url = $("#l" + i + "tb").val();
			
			if(url !== ""){
				empty = false;
				
				// remove slash from end of url if it's there
				if(url.substring(url.length - 1) === "/"){
					url = url.substring(0, url.length - 1);
					$("#l" + i + "tb").val(url);
				}
				
				imageUrls.push(url);
			}
			else{
				imageUrls.push(null);
			}
		}
		
		if(!empty){
			// validate
			var report = validateImageUrls(imageUrls);
			
			if(report.valid){
				// show loading animation
				canvasControl.showLoadingAnimation();
				
				// package content
				var content = dataAccess.packageLocalContent("", "", imageUrls, 1024, 576);
				
				if(content !== false){
					// prepare content
					dataAccess.prepareContent(content, function(content){
						imagesLoaded(content, true)
					});
				}
			}
			else{
				alert(report.errorMessage);
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

function imagesLoaded(content, userInput) {
	userInput = typeof userInput === "undefined" ? false : userInput;
	
	if(userInput){
		// check if images were valid and loaded successfully
		failedLayerNames = dataAccess.getFailedLayerNames();
		
		if(failedLayerNames.length > 0){
			// construct error message for user
			var errorMessage = "";
			
			for(var i = 0; i < failedLayerNames.length; i++){
				var layerNum = failedLayerNames[i].replace("layer", "");
				
				// color input box
				$("#l" + layerNum + "tb").addClass("invalid");
				
				// add info to error message
				errorMessage += "Layer " + layerNum + " URL failed to provide an image. Make sure it's a direct image link and try again.\n\n";
			}
			
			// show error message
			alert(errorMessage);
		}
		else{
			// enable submit button
			$("#submitButton").prop("disabled", false);
			$("#submitButton").removeClass("disabled");
		}
	}
	
	// feed content to the canvas module
	canvasControl.setContent(content);
	
	// hide loading animation
	canvasControl.hideLoadingAnimation();
}

function validateImageUrls(imageUrls) {
	var report = {
		valid : true,
		errorMessage: ""
	}
	
	for(var i = 0; i < imageUrls.length; i++){
		if(imageUrls[i] !== null){
			// check length
			if(imageUrls[i].length > 200){
				report.errorMessage += "Layer " + (i + 1) + " URL is too long. Maximum length is 200 characters.\n\n";
				report.valid = false;
				$("#l" + (i + 1) + "tb").addClass("invalid");
			}
			
			// check if url leads to an image
			var formatIndex = imageUrls[i].lastIndexOf(".");
			
			if(formatIndex !== -1){
				var imageFormat = imageUrls[i].substring(formatIndex);
				var allowed = false;
				
				for(var j = 0; j < settings.supportedImageFormats.length; j++){
					if(imageFormat === settings.supportedImageFormats[j]){
						allowed = true;
					}
				}
				
				if(!allowed){
					// invalid image format
					report.errorMessage += "Layer " + (i + 1) + " URL needs to end with one of the following: " + settings.supportedImageFormats.join("; ") + ".\n\n";
					report.valid = false;
					$("#l" + (i + 1) + "tb").addClass("invalid");
				}
			}
			else{
				// url doesn't seem to lead to an image
				report.errorMessage += "Layer " + (i + 1) + " URL needs to end with one of the following: " + settings.supportedImageFormats.join("; ") + ".\n\n";
				report.valid = false;
				$("#l" + (i + 1) + "tb").addClass("invalid");
			}
		}
	}
	
	return report;
}

// ----------- custom size inputs -----------
function monitorInputFields(on){
	if(on){
		$("#sizeXTb").on("input paste", function(element){
			onSizeInputChange(element.target);
		});
		$("#sizeYTb").on("input paste", function(element){
			onSizeInputChange(element.target);
		});
	}
	else{
		$("#sizeXTb").off("input paste", function(element){
			onSizeInputChange(element.target);
		});
		$("#sizeYTb").off("input paste", function(element){
			onSizeInputChange(element.target);
		});
	}
}

function onSizeInputChange(textBox){
	// get tooltip api
	var tooltipApi = $("#" + textBox.id).qtip("api");
	
	// validate
	if(isNaN(textBox.value)){
		textBox.value = textBox.previousValue;
	}
	else{
		if(textBox.value < textBox.minValue){
			textBox.valid = false;
			
			// destory old unexecuted timers
			if($("#canvas").get()[0].updateSizeTimeoutId != null){
				clearTimeout($("#canvas").get()[0].updateSizeTimeoutId);
				$("#canvas").get()[0].updateSizeTimeoutId = null;
			}
			
			// update tooltip
			tooltipApi.set("content.title", "Too small!");
			
			if(textBox.id == "sizeXTb"){
				tooltipApi.set("content.text", "minimum: " + settings.minimumCanvasWidth);
			}
			else if(textBox.id == "sizeYTb"){
				tooltipApi.set("content.text", "minimum: " + settings.minimumCanvasHeight);
			}
			
			// show tooltip
			tooltipApi.show();
		}
		else if(textBox.value > textBox.maxValue){
			textBox.valid = false;
			
			// destory old unexecuted timers
			if($("#canvas").get()[0].updateSizeTimeoutId != null){
				clearTimeout($("#canvas").get()[0].updateSizeTimeoutId);
				$("#canvas").get()[0].updateSizeTimeoutId = null;
			}
			
			// update tooltip
			tooltipApi.set("content.title", "Too large!");

			if(textBox.id == "sizeXTb"){
				tooltipApi.set("content.text", "maximum: " + settings.maximumCanvasWidth);
			}
			else if(textBox.id == "sizeYTb"){
				tooltipApi.set("content.text", "maximum: " + settings.maximumCanvasHeight);
			}
			
			// show tooltip
			tooltipApi.show();
		}
		else{
			textBox.valid = true;
			
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
		
		textBox.previousValue = textBox.value;
	}
}
// ------------------------------------------