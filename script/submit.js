$(document).ready(function() {
	$("#sizeXTb").get()[0].previousValue = settings.defaultCanvasWidth;
	$("#sizeYTb").get()[0].previousValue = settings.defaultCanvasHeight;

	$("#sizeXTb").get()[0].maxValue = settings.maximumCanvasWidth;
	$("#sizeXTb").get()[0].minValue = settings.minimumCanvasWidth;
	$("#sizeYTb").get()[0].maxValue = settings.maximumCanvasHeight;
	$("#sizeYTb").get()[0].minValue = settings.minimumCanvasHeight;
	
	$("#sizeXTb").get()[0].valid = true;
	$("#sizeYTb").get()[0].valid = true;
	
	$("#titleTb").get()[0].previousValue = "";
	$("#authorTb").get()[0].previousValue = "";
	
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
			
			$("#autoButton").html("auto");
			
			// hide custom size input fields
			$("#customSizeInput").slideUp();
			
			// update canvas size
			canvasControl.setCanvasSize(settings.defaultCanvasWidth, settings.defaultCanvasHeight);
			
			// save new size values
			$("#sizeXTb").val(settings.defaultCanvasWidth);
			$("#sizeYTb").val(settings.defaultCanvasHeight);
			
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
			
			if(canvasControl.getReverseAutoSizeMode()){
				$("#autoButton").html("auto [B]");
			}
			else{
				$("#autoButton").html("auto [A]");
			}
			
			// update canvas size
			canvasControl.setCanvasSize(null, null);
			
			// save new size values
			$("#sizeXTb").val(canvasControl.getContent().width);
			$("#sizeYTb").val(canvasControl.getContent().height);
			
			// hide custom size tooltips
			$("#sizeXTb").qtip("api").hide();
			$("#sizeYTb").qtip("api").hide();
		}
		else{
			// pressed again
			if(canvasControl.getReverseAutoSizeMode()){
				$("#autoButton").html("auto [A]");
				canvasControl.setReverseAutoSizeMode(false);
				
				// update canvas size
				canvasControl.setCanvasSize(null, null);
			}
			else{
				$("#autoButton").html("auto [B]");
				canvasControl.setReverseAutoSizeMode(true);
				
				// update canvas size
				canvasControl.setCanvasSize(null, null);
				
				// save new size values
				$("#sizeXTb").val(canvasControl.getContent().width);
				$("#sizeYTb").val(canvasControl.getContent().height);
			}
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
			
			$("#autoButton").html("auto");
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
				
				// enable adjust toggle button for this layer
				$("#adjust" + i + "Button").prop("disabled", false);
				$("#adjust" + i + "Button").removeClass("disabled");
			}
			else{
				imageUrls.push(null);
				
				// disable adjust toggle button for this layer
				$("#adjust" + i + "Button").prop("disabled", true);
				$("#adjust" + i + "Button").addClass("disabled");
			}
		}
		
		if(!empty){
			// validate
			var report = validateImageUrls(imageUrls);
			
			if(report.valid){
				// show loading animation
				canvasControl.showLoadingAnimation();
				
				// package content
				var content = dataAccess.packageLocalContent("", "", imageUrls, $("#sizeXTb").val(), $("#sizeYTb").val());
				
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
			$(this).html("done");
			
			// disable submit button
			$("#submitButton").prop("disabled", true);
			$("#submitButton").addClass("disabled");
			
			// disable test button
			$("#testButton").prop("disabled", true);
			$("#testButton").addClass("disabled");
			
			// change canvas cursor display
			$("#canvas").addClass("cursorMove");
			
			// turn adjust mode on
			canvasControl.enableAdjustMode();
			
			// hide input fields, show toggle buttons
			for(i = 1; i < 11; i++){
				// hide input field
				$("#l" + i + "tb").hide();
				
				// show toggle button
				$("#adjust" + i + "Button").show();
			}
		}
		else{
			$(this).removeClass("toggled");
			$(this).html("adjust");
			
			//change canvas cursor display
			$("#canvas").removeClass("cursorMove");
			
			// enable submit button
			$("#submitButton").prop("disabled", false);
			$("#submitButton").removeClass("disabled");
			
			// enable test button
			$("#testButton").prop("disabled", false);
			$("#testButton").removeClass("disabled");
			
			// turn adjust mode off
			canvasControl.disableAdjustMode();
			
			// hide toggle buttons, show input fields
			for(i = 1; i < 11; i++){
				// hide toggle button
				$("#adjust" + i + "Button").hide();
				
				// show input field
				$("#l" + i + "tb").show();
			}
		}
	});

	$("#submitButton").click(function(){
		// clear info prompt fields
		$("#titleTb").val("");
		$("#authorTb").val("");
		$("#titleTb").get()[0].previousValue = "";
		$("#authorTb").get()[0].previousValue = "";
		
		// show info prompt
		$("#modalScreen").fadeIn("fast");
		$("#infoPrompt").fadeIn("fast");
	});
	
	$("#infoPromptSubmitButton").click(function(){
		// disable changes in input fields
		$("#titleTb").attr("disabled", true);
		$("#authorTb").attr("disabled", true);
		
		// show captcha
		$("#captchaContainer").slideDown();
	});
	
	$("#infoPromptCancelButton").click(function(){
		// hide info prompt
		$("#modalScreen").fadeOut("fast");
		$("#infoPrompt").fadeOut("fast");
		
		// hide captcha
		$("#captchaContainer").hide();
		
		// re-enable info fields
		$("#titleTb").attr("disabled", false);
		$("#authorTb").attr("disabled", false);
		
		// clear info fields
		$("#titleTb").val("");
		$("#authorTb").val("");
		
	});
	
	// adjust toggle button click handlers
	for(var i = 0; i < 11; i++){
		$("#adjust" + i + "Button").click(function(){
			if(!$(this).hasClass("toggled")){
				$(this).addClass("toggled");
			}
			else{
				$(this).removeClass("toggled");
			}
		});
	}
	
	$("#moreInfo").click(function(){
		$(this).hide();
		$("#submissionInfo").slideDown("slow");
	});

	$("#navGalleryButton").click(function(){
		window.location.href = "/depth_perception";
	});

	$("#navContactButton").click(function(){
		window.location.href = "contact.html";
	});
	// -------------------------------------------
	
	$("#titleTb").on("input paste", onInfoTextBoxChange);
	$("#authorTb").on("input paste", onInfoTextBoxChange);
	
	for(var i = 1; i < 11; i++){
		$("#l" + i + "tb").on("input paste", function(element){
			// disable submit button
			$("#submitButton").prop("disabled", true);
			$("#submitButton").addClass("disabled");
			
			// disable adjust button
			$("#adjustButton").prop("disabled", true);
			$("#adjustButton").addClass("disabled");
		});
	}
	
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
			
			// enable adjust button
			$("#adjustButton").prop("disabled", false);
			$("#adjustButton").removeClass("disabled");
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

function onInfoTextBoxChange(element){
	var textBox = element.target;
	var regExp = /^[a-z 0-9_!\.,\?\-]*$/i;
	
	if(regExp.test(textBox.value)){
		// allowed
		textBox.previousValue = textBox.value;
	}
	else{
		// not allowed
		textBox.value = textBox.previousValue;
	}
}

function captchaComplete(result){
	// hide info prompt
	$("#infoPrompt").fadeOut("fast");
	
	// save info
	var content = canvasControl.getContent();
	
	content.title = $("#titleTb").val() === "" ? "Unnamed" : $("#titleTb").val();
	content.author = $("#authorTb").val() === "" ? "Anonymous" : $("#authorTb").val();
	
	// submit content
	dataAccess.submitContent(canvasControl.getContent(), result, function(success){
		if(!success){
			alert("Something went wrong. Sorry!\nPlease try again in a couple of.... hours?");
			
			// disable submit button
			$("#submitButton").prop("disabled", true);
			$("#submitButton").addClass("disabled");
			
			// disable adjust button
			$("#adjustButton").prop("disabled", true);
			$("#adjustButton").addClass("disabled");
			
			// hide loading animation
			$("#loadingImage").hide();
			
			// hide modal overlay
			$("#modalScreen").fadeOut("fast");
		}
		else{
			// success - return to gallery
			window.location.href = "/depth_perception";
		}
	});
	
	// show loading animation
	$("#loadingImage").show();
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