<?php
require_once './fileManager.php';
require_once '../../session/sessionManager.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id']) && isset($data['index'])) {
    $id = $data['id'];
    $index = $data['index'];
    $value = $data['value'];
    $objToChange = $data['objToChange'];

    // get the business data from session
    $sessionManager = new SessionManager();
    $fileManager = new FileManager(__DIR__.'/commonMovementsFiles');
    $businessData = $sessionManager->getAllSessionData();
    $businessName = $businessData['businessName'];
    $businessId = $businessData['businessId'];
    $businessAccount = $businessData['businessBankAccount'];
    
    if($businessName == null || $businessId == null || $businessAccount == null){
        echo json_encode(['status' => 'error', 'message' => 'No business data found']);
        // header('Location: ../../session/testSession.php');
        exit;
    }
    
    $movementsData = $fileManager->readCommonMovements();

    $movements = $movementsData['data'];

    // echo json_encode($movements);

    // update the value
    // $commonMovements[$id][$index][] = $value;

    // find
    $found_key = array_search($id, array_column($movements, 'id'));
    if ($found_key === false) {
        echo json_encode(['status' => 'error', 'message' => 'No data found']);
        exit;
    }

    $movements[$found_key]['movements'][$index][$objToChange] = $value;
    // // echo json_encode($movements[$found_key]['movements'][$index][$objToChange] = $value);
    // // echo json_encode($movements[$found_key]['movements'][$index][$objToChange] = $value);

    // echo json_encode($movements);

    // // $commonMovements = $movements[$found_key]['movements'];
    // exit;

    // write the updated value
    $responseWriteNewValue = $fileManager->writeMovements($movements);

    echo json_encode($responseWriteNewValue);


    // echo json_encode(['status' => 'success', 'message' => 'Update successful']);
} else {
    echo ['status' => 'error', 'message' => 'Invalid input'];
}


?>