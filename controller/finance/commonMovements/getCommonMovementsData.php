<?php
require_once './fileManager.php';
require_once '../../session/sessionManager.php';

// get post data and get the file name on folder commonMovementsFiles
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $businessName = $data['businessName'];
    $businessId = $data['businessId'];
    $businessAccount = $data['businessAccount'];
    $directory = __DIR__ . '/commonMovementsFiles';
    $filePath = $directory . "/$businessId$businessAccount"."_"."$businessName.json";

    $sessionManager = new SessionManager();
    $businessData = $sessionManager->getAllSessionData();
    $businessName = $businessData['businessName'];
    $businessId = $businessData['businessId'];
    $businessAccount = $sessionManager->get('businessBankAccounts')[0]['account_number'];



    $fileManager = new FileManager(__DIR__.'/commonMovementsFiles');
    $response = $fileManager->readCommonMovements();

    echo json_encode($response);
    



    // // echo $filePath;
    // if (file_exists($filePath)) {
    //     $commonMovements = json_decode(file_get_contents($filePath), true);
    //     // check if data is null
    //     if (empty($commonMovements)) {
    //         echo json_encode(['status' => 'success', 'message' => 'Data fetched successfully', "data" => []]);
    //         exit;
    //     }
    //     echo json_encode(['status' => 'success', 'message' => 'Data fetched successfully', "data" => $commonMovements]);
    // } else {
    //     echo json_encode(['status' => 'error', 'message' => 'No data found',"data"=>[]]);
    // }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>