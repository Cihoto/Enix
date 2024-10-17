<?php
require_once './fileManager.php';
require_once '../../session/sessionManager.php';

// get post data and get the file name on folder commonMovementsFiles
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

   
    $sessionManager = new SessionManager();
    $businessData = $sessionManager->getAllSessionData();
    $businessName = $businessData['businessName'];
    $businessId = $businessData['businessId'];
    $businessAccount = $sessionManager->get('businessBankAccounts')[0]['account_number'];



    $fileManager = new FileManager(__DIR__.'/commonMovementsFiles');
    $response = $fileManager->readCommonMovements();

    echo json_encode($response);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>