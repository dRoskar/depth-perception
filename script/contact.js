$(document).ready(function() {
	$("#sendButton").click(function(){
		$("#captchaContainer").slideDown();
	});
});

function captchaComplete(result){
	// send message
	dataAccess.sendMessage($("#textBoxMail").val(), $("#textAreaMessage").val(), result, function(success){
		if(success){
			// message recieved
			$("#emailLabel").hide();
			$("#messageLabel").hide();
			$("#textBoxMail").hide();
			$("#textAreaMessage").hide();
			$("#sendButton").hide();
			$("#captchaContainer").hide();
			$("#messageRecievedFeedback").slideDown();
		}
		else{
			// message failed to send
			alert("Something went wrong... sorry.");
		}
	});
}