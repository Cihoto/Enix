<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/finance/commonMovements/fileManager.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/session/sessionManager.php';

// get post data
$data = json_decode(file_get_contents('php://input'), true);
$document = $data['modifiedDocuments'];

$sessionManager = new sessionManager();
$fileManager = new FileManager(__DIR__.'/modifiedMovementsFiles');

$data = $fileManager->readModifiedFile();


// ECHO json_encode($data);

if(count($data['data']) == 0){
    $data = $fileManager->writeModifiedDocuments($document);
}
$data = $fileManager->writeModifiedDocuments($document);

echo json_encode($data);







