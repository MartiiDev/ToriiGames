<?php
header('Content-Type: image/jpeg');
$img = imagecreatefromjpeg(base64_decode($_GET['img']));
imagejpeg($img);
imagedestroy($img);
?>