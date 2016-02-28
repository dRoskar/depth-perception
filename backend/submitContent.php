<?php
define("DEFAULT_WIDTH", 1024);
define("DEFAULT_HEIGHT", 576);
define("MINIMUM_WIDTH", 250);
define("MINIMUM_HEIGHT", 200);
define("MAXIMUM_WIDTH", 1920);
define("MAXIMUM_HEIGHT", 1200);
define("ALLOWED_FORMATS", ".png|.jpg|.bmp|.gif|.svg");

// get content
$content = $_POST["content"];

if($content === "" || $content === null){
	echo "ERROR: no data was passed";
	return;
}

// convert data to object
$content = json_decode($content, true);

if($content === null){
	echo "ERROR: failed to parse json data";
	return;
}

// validate
$valid = validateContent($content);

if($valid === false){
	echo "ERROR: content invalid";
	return;
}

// content is valid - establish db connection
$dbconn = pg_connect("host=localhost dbname=dr_services user=postgres password='kingdomdb'"); // yes, i know there's a password here. It's local, I don't care.

if(!$dbconn){
	echo "ERROR: failed to connect to database";
	return;
}

// create unique identifier
$hash = createUniqueIdentifier($dbconn, $content);

// get latest page

// insert new entry


pg_close($dbconn);

// ------------------------------------------------------
function validateContent($content){
	// title
	if(array_key_exists("title", $content) && is_string($content["title"]) && strlen($content["title"]) <= 30){
		if($content["title"] === ""){
			$content["title"] = "Unnamed";
		}
	}
	else{
		return false;
	}
	
	// author
	if(array_key_exists("author", $content) && is_string($content["author"]) && strlen($content["author"]) <= 30){
		if($content["author"] === ""){
			$content["author"] = "Anonymous";
		}
	}
	else{
		return false;
	}
	
	// width
	if(array_key_exists("width", $content) && is_int($content["width"])){
		if($content["width"] < MINIMUM_WIDTH || $content["width"] > MAXIMUM_WIDTH){
			$content["width"] = DEFAULT_WIDTH;
		}
	}
	else{
		return false;
	}
	
	// height
	if(array_key_exists("height", $content) && is_int($content["height"])){
		if($content["height"] < MINIMUM_HEIGHT || $content["height"] > MAXIMUM_HEIGHT){
			$content["height"] = DEFAULT_HEIGHT;
		}
	}
	else{
		return false;
	}
	
	// image urls
	if(array_key_exists("images", $content) && is_array($content["images"]) && count($content["images"]) === 10){
		$empty = true;
		$allowedImageFormats = explode("|", ALLOWED_FORMATS);
		
		foreach($content["images"] as $image){
			if(array_key_exists("url", $image)){
				if($image["url"] === null){
					continue;
				}
				
				// check f it's a string
				if(is_string($image["url"]) === false){
					return false;
				}
					
				$empty = false;
				
				// check if it's too long
				if(strlen($image["url"]) > 200){
					return false;
				}
				
				// check if it ends with a valid image format
				$dotIndex = strrpos($image["url"], ".");
				
				if($dotIndex !== false){
					$urlEnding = substr($image["url"], $dotIndex);
					
					// check if image format is allowed
					$allowed = false;
					foreach($allowedImageFormats as $allowedFormat){
						if($allowedFormat === $urlEnding){
							$allowed = true;
							break; 
						}
					}
					
					if($allowed === false){
						return false;
					}
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		}
		
		if($empty === true){
			return false;
		}
	}
	else{
		return false;
	}
	
	return true;
}

function createUniqueIdentifier($dbconn, $content, $counter = 0){
	$imageUrls = array();
	foreach($content["images"] as $image){
		if($image["url"] !== null){
			array_push($imageUrls, $image["url"]);
		}
	}
	
	$hash = hash("sha256", "" . $content["title"] . " " . $content["author"] . " " . join(" ", $imageUrls) . " " . $counter);
	$hash = substr($hash, 0, 8);
	
	// check if an entry with this identifier already exists
	$sql = "SELECT EXISTS(SELECT 1 FROM dp_entries WHERE hash='$hash') AS exists";
	$result = pg_query($dbconn, $sql);
	
	if(!$result){
		return "ERROR";
	}
	
	if(pg_fetch_row($result)[0] === "t"){
		// this identidier already exists
		$hash = createUniqueIdentifier($dbconn, $content, ++$counter);
	}
		
	return $hash;
}
?>