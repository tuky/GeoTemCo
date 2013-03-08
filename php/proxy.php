<?php 
	//Hosts that are allowed to download from. (e.g. "dropbox.com" and "www.dropbox.com")
	//If this array is empty, all hosts are allowed.
	$validHosts = array(
			"localhost"
	);

	if (isset($_REQUEST['address'])){

		$parsedAddress = parse_url($_REQUEST['address']);
		
		if ((count($validHosts)==0) || in_array($parsedAddress["host"], $validHosts))
			echo file_get_contents($_REQUEST['address']);
	}
?>