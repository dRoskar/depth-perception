// data access module
var dataAccess = function(){
	var loadedCount = 0;
	var loading = false;
	var content = null;
	
	// public methods
	return {
		isLoading: function() { return loading; },
		
		getContent: function() { return content; },
		
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
						content = {
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
					}
					else{
						// get 404 images
						dataAccess.loadContent("404", null, callback);
						return;
					}
					
					// supply source to image objects and wait for all images to load
					for(var key in content.images){
						var url = content.images[key].url;
						
						// notify onload
						content.images[key].imageObj.onload = function(){
							loadedCount++;
							
							if(loadedCount == 10){
								// all images loaded
								if(typeof(callback) == "function"){
									callback();
									
									loading = false;
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
				}
			});
		},
		
		submitContent: function() {
			console.log("I don't do anything yet");
		}
	};
}();