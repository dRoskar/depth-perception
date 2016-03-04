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
	error_log("ERROR: no data was passed");
	echo "#ERROR";
	return;
}

// convert data to object
$content = json_decode($content, true);

if($content === null){
	error_log("ERROR: failed to parse json data");
	echo "#ERROR";
	return;
}

// validate
$valid = validateContent($content);

if($valid === false){
	error_log("ERROR: content invalid");
	echo "#ERROR";
	return;
}

// content is valid - establish db connection
$dbconn = pg_connect("host=localhost dbname=dr_services user=postgres password='kingdomdb'");

if(!$dbconn){
	error_log("ERROR: failed to connect to database");
	echo "#ERROR";
	return;
}

// create unique identifier
$hash = createUniqueIdentifier($dbconn, $content);

if($hash === "ERROR"){
	error_log("ERROR: failed to create a unique identifier");
	echo "#ERROR";
	pg_close($dbconn);
	return;
}

// get latest page
$sql = "SELECT page FROM dp_entries ORDER BY page DESC LIMIT 1";
$result = pg_query($dbconn, $sql);

if(!$result){
	error_log("ERROR: failed to retrieve last page");
	echo "#ERROR";
	pg_close($dbconn);
	return;
}

$page = pg_fetch_row($result)[0];
$page++;

// insert new entry
$layers = array();
foreach($content["images"] as $image){
	$layer = array(
		"url" => $image["url"] === null ? "null" : "'" . $image["url"] . "'",
		"offsetX" => $image["offsetX"],
		"offsetY" => $image["offsetY"],
	);
	
	array_push($layers, $layer);
}

$sql = "INSERT INTO dp_entries (title, author,
		layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10,
		offset1x, offset2x, offset3x, offset4x, offset5x, offset6x, offset7x, offset8x, offset9x, offset10x,
		offset1y, offset2y, offset3y, offset4y, offset5y, offset6y, offset7y, offset8y, offset9y, offset10y,
		page, hash, canvas_width, canvas_height
		) VALUES (
		'" . $content["title"] . "', '" . $content["author"] . "', 
		" . $layers[0]["url"] . ", " . $layers[1]["url"] . ", " .$layers[2]["url"] . ", " . $layers[3]["url"] . ", " . $layers[4]["url"] . ", " . $layers[5]["url"] . ", " . $layers[6]["url"] . ", " . $layers[7]["url"] . ", " . $layers[8]["url"] . ", " . $layers[9]["url"] . ", 
		" . $layers[0]["offsetX"] . ", " . $layers[1]["offsetX"] . ", " .$layers[2]["offsetX"] . ", " . $layers[3]["offsetX"] . ", " . $layers[4]["offsetX"] . ", " . $layers[5]["offsetX"] . ", " . $layers[6]["offsetX"] . ", " . $layers[7]["offsetX"] . ", " . $layers[8]["offsetX"] . ", " . $layers[9]["offsetX"] . ", 
		" . $layers[0]["offsetY"] . ", " . $layers[1]["offsetY"] . ", " .$layers[2]["offsetY"] . ", " . $layers[3]["offsetY"] . ", " . $layers[4]["offsetY"] . ", " . $layers[5]["offsetY"] . ", " . $layers[6]["offsetY"] . ", " . $layers[7]["offsetY"] . ", " . $layers[8]["offsetY"] . ", " . $layers[9]["offsetY"] . ",
		$page, '$hash', " . $content["width"] . ", " . $content["height"] . ")";

$result = pg_query($dbconn, $sql);

if(!$result){
	error_log("ERROR: failed to insert new content");
	echo "#ERROR";
	pg_close($dbconn);
	return;
}

echo "#SUCCESS";

pg_close($dbconn);

return;

// ------------------------------------------------------
function validateContent(&$content){
	// title
	if(array_key_exists("title", $content) && is_string($content["title"]) && strlen($content["title"]) <= 30){
		if($content["title"] === ""){
			$content["title"] = "Unnamed";
		}
		else{
			// check if it matches allowed pattern
			if(!preg_match("/^[a-z 0-9_!\.,\?\-]+$/i", $content["title"])){
				return false;
			}
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
		else{
			// check if it matches allowed pattern
			if(!preg_match("/^[a-z 0-9_!\.,\?\-]+$/i", $content["author"])){
				return false;
			}
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
				
				// check if offsets are valid
				if(array_key_exists("offsetX", $image) && array_key_exists("offsetY", $image) && is_int($image["offsetX"]) && is_int($image["offsetY"])){
					// all good
				}
				else{
					return false;
				}
				
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
				
				// check if it contains unallowed characters
				if(preg_match("/[';\(\)\[\]]/i", $image["url"])){
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