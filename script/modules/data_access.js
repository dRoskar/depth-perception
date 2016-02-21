// data access module
var dataAccess = function(){
	var loadedCount = 0;
	var loading = false;
	
	// private methods
	var packageLocalContent = function(title, author, imageUrlList, canvasWidth, canvasHeight) {
		console.log(title);
		
		// validation
		title = (title === null || title ==="") ? "Unnamed" : title;
		author = (author === null || author ==="") ? "Anonymous" : author;
		
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
				title: data[1],
				author: (data[2] == "" || data[2] == null) ? "Anonymous" : data[2],
				images: {},
				width: data[15],
				height: data[16]
			};
		
		for(var i = 1; i < 11; i++){
			content.images["layer" + i] = {
					url: imageUrlList[i - 1],
					imageObj: new Image(),
					x: "",
					y: "",
					factor: settings["layer" + i + "Factor"]
			};
		}
		
		return content;
	};
	
	var prepareContent = function(content, callback) {
		// supply source to image objects and wait for all images to load
		for(var key in content.images){
			var url = content.images[key].url;
			
			// notify onload
			content.images[key].imageObj.onload = function(){
				loadedCount++;
				
				if(loadedCount == 10){
					// all images loaded
					loading = false;
					
					if(typeof(callback) == "function"){
						callback(content);
					}
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
	};
	
	// public methods
	return {
		isLoading: function() { return loading; },
		
		loadContent: function(hash, nav, callback) {
			loading = true;
			
			if(hash == null){
				hash = "";
			}
			
			if(nav == null){
				nav = "";
			}
			
			$.get("backend/getContent.php?i=" + hash + "&n=" + nav, function(data) {
				if(data == "false"){
					// error
				}
				else{
					loadedCount = 0;
					
					// create data set
					data = JSON.parse(data);
					
					if(!data.hasOwnProperty("error")){
						var content = {
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
									x: "",
									y: "",
									factor: settings["layer" + i + "Factor"]
							};
						}
						
						prepareContent(content, callback);
					}
					else{
						// get 404 images
						dataAccess.loadContent("404", null, callback);
						return;
					}
				}
			});
		},
		
		submitContent: function() {
			console.log("I don't do anything yet");
		}
	};
}();