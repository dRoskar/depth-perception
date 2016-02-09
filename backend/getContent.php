<?php

// get params
$hash = $_GET["i"];
$nav = $_GET["n"];

// establish db connection
$dbconn = pg_connect("host=localhost dbname=dr_services user=postgres password='kingdomdb'"); // yes, i know there's a password here. It's local, I don't care.

if(!$dbconn){
	echo "ERROR: failed to connect to database";
	return;
}

if($hash == null){
	// return latest content
	$result = getLatestContent($dbconn);
	
	if($result === "ERROR"){
		echo "ERROR: retrieving content failed";
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
			echo "ERROR: retrieving content failed";
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
				echo "ERROR: retrieving content failed";
				return;
			}
			else{
				echo $result;
				return;
			}
		}
		
		// get this item's page
		$page = getPageForItem($hash, $dbconn);
		
		if($page === "ERROR"){
			echo "ERROR: getting current item's page failed";
			return;
		}
				
		if($nav === "next"){
			$page++;
			
			// get canvas content for next item
			$pageExists = pageExists($page, $dbconn);
			
			if($pageExists === "ERROR"){
				echo "ERROR: checking if page $page exists failed";
				return;
			}
			
			if($pageExists){
				$result = getContentForPage($page, $dbconn);
				
				if($result === "ERROR"){
					echo "ERROR: retrieving content failed";
				}
				else{
					echo $result;
				}
			}
			else{
				// went full circle, get first page
				$result = getContentForPage(1, $dbconn);
				
				if($result === "ERROR"){
					echo "ERROR: retrieving content failed";
				}
				else{
					echo $result;
				}
			}
		}
		else if($nav === "previous"){
			// get canvas content for previous item
			$page--;
			
			if($page == 0){
				// went full circle get latest content
				$result = getLatestContent($dbconn);
				
				if($result === "ERROR"){
					echo "ERROR: retrieving content failed";
					return;
				}
				else{
					echo $result;
					return;
				}
			}
			
			// get page content
			$result = getContentForPage($page, $dbconn);
			
			if($result === "ERROR"){
				echo "ERROR: retrieving content failed";
			}
			else{
				echo $result;
			}
		}
		else{
			echo "false";
		}
	}
}

pg_close($dbconn);

// ------------------------------------------------------
function getLatestContent($dbconn){
	$sql = "SELECT * FROM dp_entries ORDER BY page DESC LIMIT 1";
	$result = pg_query($dbconn, $sql);
	
	if(!$result){
		return "ERROR";
	}
	
	return json_encode(pg_fetch_row($result));
}

function getContentForHash($hash, $dbconn){
	$sql = "SELECT * FROM dp_entries WHERE hash = '$hash'";
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
	$sql = "SELECT * FROM dp_entries WHERE page = $page";
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