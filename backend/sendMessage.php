<?php 

// get params
$email = $_POST["email"];
$message = $_POST["message"];

// validate
if(!($email !== null && is_string($email) && strlen($email) < 51)){
	$email = "";
}

if($message !== null && is_string($message) && $message !== "" && strlen($message) < 501){
	// send message
	mail("damjan.roskar.s@gmail.com","Depth perception contact - " . $email, $message);
	echo "#SUCCESS";
}
else{
	echo "#ERROR";
}
?>