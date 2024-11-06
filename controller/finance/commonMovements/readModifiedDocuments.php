<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/finance/commonMovements/fileManager.php';

$sessionManager = new sessionManager();
$fileManager = new FileManager(__DIR__.'/modifiedMovementsFiles');

$data = $fileManager->readModifiedFile();
echo json_encode($data);
?>


