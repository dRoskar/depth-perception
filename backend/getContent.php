<?php

// get params
$hash = $_GET["i"];
$nav = $_GET["n"];

// establish db connection
$dbconn = pg_connect("host=localhost dbname=dr_services user=postgres password='kingdomdb'");

if(!$dbconn){
	error_log("ERROR: failed to connect to database");
	echo "#ERROR";
	return;
}

if($hash == null){
	// return latest content
	$result = getLatestContent($dbconn);
	
	if($result === "ERROR"){
		error_log("ERROR: retrieving content failed - return latest content");
		echo "#ERROR";
	}
	else{
		echo $result;
	}
}
else{
	if($nav == null){
		// get canvas content for selected hash
		$result = getContentForHash($hash, $dbconn);
		
		if($result === "ERROR"){
			error_log("ERROR: retrieving content failed - get canvas content for selected hash");
			echo "#ERROR";
		}
		else{
			echo $result;
		}
	}
	else{ // navigate to next or previous item
		// if user is navigating from 404, load latest conetent
		if($hash === "404"){
			$result = getLatestContent($dbconn);
				
			if($result === "ERROR"){
				error_log("ERROR: retrieving content failed - get 404 content");
				echo "#ERROR";
				pg_close($dbconn);
				return;
			}
			else{
				echo $result;
				pg_close($dbconn);
				return;
			}
		}
		
		// get this item's page
		$page = getPageForItem($hash, $dbconn);
		
		if($page === "ERROR"){
			error_log("ERROR: getting current item's page failed");
			echo "#ERROR";
			pg_close($dbconn);
			return;
		}
				
		if($nav === "next"){
			$page++;
			
			// get canvas content for next item
			$pageExists = pageExists($page, $dbconn);
			
			if($pageExists === "ERROR"){
				error_log("ERROR: checking if page $page exists failed");
				echo "#ERROR";
				pg_close($dbconn);
				return;
			}
			
			if($pageExists){
				$result = getContentForPage($page, $dbconn);
				
				if($result === "ERROR"){
					error_log("ERROR: retrieving content failed - get canvas content for next item");
					echo "#ERROR";
					pg_close($dbconn);
					return;
				}
				else{
					echo $result;
					pg_close($dbconn);
					return;
				}
			}
			else{
				// went full circle, get first page
				$result = getContentForPage(0, $dbconn);
				
				if($result === "ERROR"){
					error_log("ERROR: retrieving content failed - went full circle, get first page");
					echo "#ERROR";
					pg_close($dbconn);
					return;
				}
				else{
					echo $result;
					pg_close($dbconn);
					return;
				}
			}
		}
		else if($nav === "previous"){
			// get canvas content for previous item
			$page--;
			
			if($page == -1){
				// went full circle get latest content
				$result = getLatestContent($dbconn);
				
				if($result === "ERROR"){
					error_log("ERROR: retrieving content failed - went full circle get latest content");
					echo "#ERROR";
					pg_close($dbconn);
					return;
				}
				else{
					echo $result;
					pg_close($dbconn);
					return;
				}
			}
			
			// get page content
			$result = getContentForPage($page, $dbconn);
			
			if($result === "ERROR" || $result === "false"){
				error_log("ERROR: retrieving content failed - get page content");
				echo "#ERROR";
			}
			else{
				echo $result;
			}
		}
		else{
			echo "#ERROR";
		}
	}
}

pg_close($dbconn);

// ------------------------------------------------------
function getLatestContent($dbconn){
	$sql = "SELECT title, author, 
			layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10, 
			page, hash, canvas_width, canvas_height, 
			offset1x, offset2x, offset3x, offset4x, offset5x, offset6x, offset7x, offset8x,	offset9x, offset10x, 
			offset1y, offset2y, offset3y, offset4y, offset5y, offset6y, offset7y, offset8y,	offset9y, offset10y
			FROM dp_entries ORDER BY page DESC LIMIT 1";
	$result = pg_query($dbconn, $sql);
	
	if(!$result){
		return "ERROR";
	}
	
	return json_encode(pg_fetch_row($result));
}

function getContentForHash($hash, $dbconn){
	$sql = "SELECT title, author, 
			layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10, 
			page, hash, canvas_width, canvas_height, 
			offset1x, offset2x, offset3x, offset4x, offset5x, offset6x, offset7x, offset8x,	offset9x, offset10x, 
			offset1y, offset2y, offset3y, offset4y, offset5y, offset6y, offset7y, offset8y,	offset9y, offset10y
			FROM dp_entries WHERE hash = '$hash'";
	$result = pg_query($dbconn, $sql);
	
	if(!$result){
		return "ERROR";
	}
	
	$row = pg_fetch_row($result);
	
	if($row == false){
		return json_encode(array("error"=>"404"));
	}
	else{
		return json_encode($row);
	}
}

function getContentForPage($page, $dbconn){
	$sql = "SELECT title, author, 
			layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10, 
			page, hash, canvas_width, canvas_height, 
			offset1x, offset2x, offset3x, offset4x, offset5x, offset6x, offset7x, offset8x,	offset9x, offset10x, 
			offset1y, offset2y, offset3y, offset4y, offset5y, offset6y, offset7y, offset8y,	offset9y, offset10y
			FROM dp_entries WHERE page = $page";
	$result = pg_query($dbconn, $sql);
	
	if(!$result){
		return "ERROR";
	}
	
	return json_encode(pg_fetch_row($result));
}

function getPageForItem($hash, $dbconn){
	$sql = "SELECT page FROM dp_entries WHERE hash = '$hash'";
	$result = pg_query($dbconn, $sql);
		
	if(!$result){
		return "ERROR";
	}
		
	return pg_fetch_row($result)[0];
}

function pageExists($page, $dbconn){
	$sql = "SELECT EXISTS(SELECT title FROM dp_entries WHERE page=$page)";
	$result = pg_query($dbconn, $sql);
	
	if(!$result){
		return "ERROR";
	}
	
	return pg_fetch_row($result)[0] === "t" ? true : false;
}
?>