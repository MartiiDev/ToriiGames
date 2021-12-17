<?php
header('Access-Control-Allow-Origin: *');
if (isset($_GET['url'])) {
	$html = file_get_contents($_GET['url']);
	echo $html;
}
?>