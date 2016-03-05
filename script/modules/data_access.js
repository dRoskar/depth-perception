// data access module
var dataAccess = function(){
	var loadedCount = 0;
	var loading = false;
	var failedLayerNames = [];
	
	// public methods
	return {
		isLoading: function() { return loading; },
		
		getFailedLayerNames : function() { return failedLayerNames; },
		
		loadContent: function(hash, nav, callback) {
			loading = true;
			
			if(hash == null){
				hash = "";
			}
			
			if(nav == null){
				nav = "";
			}
			
			$.get("backend/getContent.php?i=" + hash + "&n=" + nav, function(data) {
				if(data.indexOf("#ERROR") > -1){
					// error
					if(typeof callback == "function"){
						callback(false);
					}
				}
				else{
					// create data set
					
					data = JSON.parse(data);
					
					if(!data.hasOwnProperty("error")){
						var content = {
							title: (data[0] == "" || data[0] == null) ? "Unnamed" : data[0],
							author: (data[1] == "" || data[1] == null) ? "Anonymous" : data[1],
							images: {},
							hash: data[13],
							width: parseInt(data[14]),
							height: parseInt(data[15])
						};
						
						for(var i = 1; i < 11; i++){
							content.images["layer" + i] = {
									url: data[i + 1],
									imageObj: new Image(),
									x: "",
									y: "",
									offsetX: parseInt(data[i + 15] == null ? 0 : data[i + 15]),
									offsetY: parseInt(data[i + 25] == null ? 0 : data[i + 25]),
									factor: settings["layer" + i + "Factor"]
							};
						}
						
						dataAccess.prepareContent(content, callback);
					}
					else{
						// get 404 images
						dataAccess.loadContent("404", null, callback);
						return;
					}
				}
			});
		},
		
		packageLocalContent: function(title, author, imageUrlList, canvasWidth, canvasHeight) {
			// validation
			title = (title === null || title === "") ? "Unnamed" : title;
			author = (author === null || author === "") ? "Anonymous" : author;
			
			if(isNaN(canvasWidth) || isNaN(canvasHeight)){
				return false;
			}
			else{
				if(canvasWidth < 250 || canvasWidth > 9000 || canvasHeight < 200 || canvasHeight > 9000){
					return false;
				}
			}
			
			if(imageUrlList.length != 10){
				return false;
			}
			
			// create content object
			var content = {
					title: title,
					author: author,
					images: {},
					width: canvasWidth,
					height: canvasHeight
				};
			
			for(var i = 1; i < 11; i++){
				content.images["layer" + i] = {
						url: imageUrlList[i - 1],
						imageObj: new Image(),
						x: "",
						y: "",
						offsetX: 0,
						offsetY: 0,
						factor: settings["layer" + i + "Factor"]
				};
			}
			
			return content;
		},
		
		prepareContent: function(content, callback) {
			loadedCount = 0;
			failedLayerNames = [];
			
			// supply source to image objects and wait for all images to load
			for(var key in content.images){
				var url = content.images[key].url === null ? "images/empty.gif" : content.images[key].url;
				
				content.images[key].imageObj.imageIndex = key;
				
				// notify onload
				content.images[key].imageObj.onload = function(){
					loadedCount++;
					
					if(loadedCount == 10){
						// all images loaded
						loading = false;
						
						if(typeof(callback) == "function"){
							callback(content);
							loadedCount = 0;
						}
					}
				}
				
				// switch src to a local 404 image if images doesn't exist
				content.images[key].imageObj.onerror = function(){
					this.onerror = null;
					failedLayerNames.push(this.imageIndex);
					this.src = "images/localContent/missingImage.png";
				}
				
				// set image src
				content.images[key].imageObj.src = url;
			}
		},
		
		submitContent: function(ct, callback) {
			$.post("backend/submitContent.php", {
				content: JSON.stringify(ct)
			}, 
			function(reply){
				if(reply === "#SUCCESS"){
					if(typeof callback == "function"){
						callback(true);
					}
				}
				else{
					if(typeof callback == "function"){
						callback(false);
					}
				}
			});
		},
		
		sendMessage: function(email, message, captchaResult, callback){
			$.post("backend/sendMessage.php", {
				email: email,
				message: message,
				captchaResult: captchaResult
			},
			function(reply){
				if(reply === "#SUCCESS"){
					if(typeof callback == "function"){
						callback(true);
					}
				}
				else{
					if(typeof callback == "function"){
						callback(false);
					}
				}
			});
		}
	};
}();