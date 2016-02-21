// keyboard module
var keyboard = function() {
	var keyIsDown = false;
	var registered = [];
	
	// init
	(function() {
		// keydown event
		$(document).keydown(function(e) {
			if(!keyIsDown){
				for(var key in registered){
					if(registered.hasOwnProperty(key)){
						if(e.keyCode === registered[key].keyCode){
							keyIsDown = true;
							registered[key].action();
						}
					}
				}
			}
		});
		
		// keyup event
		$(document).keyup(function(e) {
			 keyIsDown = false;
		});
	})();
	
	// public methods
	return {
		registerKeyDownAction: function(keyCode, action) {
			if(!isNaN(keyCode) && typeof(action) == "function"){
				keyObject = {
						keyCode: keyCode,
						action: action
				};
				registered.push(keyObject);
				
				return true;
			}
			else{
				return false;
			}
		}
	}
}();