$(document).ready(function() {
	$("#sendButton").click(function(){
		dataAccess.sendMessage($("#textBoxMail").val(), $("#textAreaMessage").val(), function(success){
			if(success){
				// message recieved
				$("#emailLabel").hide();
				$("#messageLabel").hide();
				$("#textBoxMail").hide();
				$("#textAreaMessage").hide();
				$("#sendButton").hide();
				$("#messageRecievedFeedback").slideDown();
			}
			else{
				// message failed to send
				alert("Something went wrong... sorry.");
			}
		});
	});
});