<?php 

// get params
$email = $_POST["email"];
$message = $_POST["message"];
$captchaResult = $_POST["captchaResult"];

// check captcha
$captchaCeheckData = array(
		"secret" => "**************************************", // secret API key goes here
		"response" => $captchaResult,
);

$response = post("https://www.google.com/recaptcha/api/siteverify", $captchaCeheckData);

$response = json_decode($response, true);

if(is_array($response) && in_array("success", $response)){
	if($response["success"] === true){
		// user is not a robot - validate input
		if(!($email !== null && is_string($email) && strlen($email) < 51)){
			$email = "";
		}
		
		if($message !== null && is_string($message) && $message !== "" && strlen($message) < 501){
			// send message
			mail("damjan.roskar.s@gmail.com","Depth perception contact - " . $email, $message);
			echo "#SUCCESS";
		}
		else{
			error_log("ERROR: Contact - contact input was invalid");
			echo "#ERROR";
		}
	}
	else{
		// robot attack
		if(in_array("error-codes", $response)){
			$errorCodes = $response["error-codes"];
			
			error_log("ERROR: Contact - reCaptcha response error codes:");
			foreach ($errorCodes as $code){
				error_log("    $code");
			}
		}
		
		echo "#ERROR";
	}
}
else{
	error_log("ERROR: Contact - capthca check failed to respond with a json file");
	echo "#ERROR";
}

// ------------------------------

function post($url, $data){
	$options;
	if($data === null){
		$options = array(
				"http" => array(
						"header" => "Content-type: application/x-www-form-urlencoded\r\n",
						"method" => "POST"
				)
		);
	}
	else{
		$options = array(
				"http" => array(
						"header" => "Content-type: application/x-www-form-urlencoded\r\n",
						"method" => "POST",
						"content" => http_build_query($data)
				)
		);
	}

	$context = stream_context_create($options);

	// execute POST
	return file_get_contents($url, false, $context);
}
?>