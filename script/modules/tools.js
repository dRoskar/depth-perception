// tools module
var tools = function() {
	return {
		getObjectSize: function(object) {
			var count = 0;
			
			for(var key in object){
				if(object.hasOwnProperty(key)){
					count++;
				}
			}
			
			return count;
		},
		
		getUrlParams: function() {
			var params = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
				params[key] = value;
			});
			
			return params;
		},
		
		getUrlWithoutParameters: function() {
			var url = window.location.href;
			if(window.location.href.indexOf("?") > 0){
				return window.location.href.substring(0, window.location.href.indexOf("?"));
			}
			
			return window.location.href;
		},
		
		getCanvasRelativePosition: function(canvas, x, y) {
			var rect = canvas.getBoundingClientRect();
			
			return {x: x - rect.left, y: y - rect.top};
		}
	};
}();