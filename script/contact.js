$(document).ready(function() {
	$("#sendButton").click(function(){
		if($("#textAreaMessage").val() !== ""){
			// disable changes in input fields
			$("#textBoxMail").attr("disabled", true);
			$("#textAreaMessage").attr("disabled", true);
			
			$("#captchaContainer").slideDown();
		}
		else{
			alert("Write something first");
		}
	});
	
	$("#navGalleryButton").click(function(){
		window.location.href = "/depth_perception";
	});
	
	$("#navSubmitButton").click(function() {
		window.location.href = "submit.html";
	});
});

function captchaComplete(result){
	// send message
	dataAccess.sendMessage($("#textBoxMail").val(), $("#textAreaMessage").val(), result, function(success){
		if(success){
			// message received
			$("#emailLabel").hide();
			$("#messageLabel").hide();
			$("#textBoxMail").hide();
			$("#textAreaMessage").hide();
			$("#sendButton").hide();
			$("#captchaContainer").hide();
			$("#messageReceivedFeedback").slideDown();
		}
		else{
			// message failed to send
			alert("Something went wrong... sorry.");
		}
	});
}