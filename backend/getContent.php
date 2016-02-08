<?php
$page = $_GET["p"];

// establish db connection
$dbconn = pg_connect("host=localhost dbname=dr_services user=postgres password='kingdomdb'"); // yes, i know there's a password here. It's local, I don't care.

if(!$dbconn){
	echo "failed to connect to database";
	return;
}

if($page == null){
	// return latest content
	$sql = "SELECT * FROM dp_entries ORDER BY page DESC LIMIT 1";
	$result = pg_query($dbconn, $sql);
	
	if(!$result){
		echo "SQL error when returning content";
		return;
	}
	
	echo json_encode(pg_fetch_row($result));
}
else{
	// get canvas content for selected page
	$sql = "SELECT * FROM dp_entries WHERE page = $page";
	$result = pg_query($dbconn, $sql);
	
	if(!$result){
		echo "SQL error when returning content";
		return;
	}
	
	echo json_encode(pg_fetch_row($result));
}
?>