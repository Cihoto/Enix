<?php
require_once './fileManager.php';

$sessionManager = new sessionManager();
$fileManager = new FileManager(__DIR__.'/modifiedMovementsFiles');

$data = $fileManager->readModifiedFile();
echo json_encode($data);
?>