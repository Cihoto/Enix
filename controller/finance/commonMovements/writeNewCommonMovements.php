<?php 

    require_once $_SERVER['DOCUMENT_ROOT'].'/controller/session/sessionManager.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $sessionManager = new SessionManager();
        
        $businessName = $sessionManager->get('businessName');
        $businessId = $sessionManager->get('businessId');
        $businessAccount = $sessionManager->get('businessBankAccounts');
        $businessAccountNumber = $businessAccount[0]['account_number'];
        

        if (empty($businessName) || empty($businessId) || empty($businessAccountNumber)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid business data']);
            exit;
        }

        // check if data is null
        $commonMovements = $data['commonMovements'];


        if (json_last_error() === JSON_ERROR_NONE) {
            $directory = __DIR__ . '/commonMovementsFiles';
            if (!is_dir($directory)) {
                mkdir($directory, 0777, true);
            }
            $filePath = $directory . "/$businessId$businessAccountNumber"."_"."$businessName.json";
            if (!file_exists($filePath)) {
                file_put_contents($filePath, '');
            }
            $existingData = file_exists($filePath) != '' ? json_decode(file_get_contents($filePath), true) :[]; 
            // check if data is null 
            if (empty($existingData)) {
                $existingData = [];
            }
            // check if data is null
            if (empty($commonMovements)) {
                echo json_encode(['status' => 'error', 'message' => 'No data to save']);
                exit;
            }

            // decode on json and merge two json arrays
            $newData = array_merge($existingData, $commonMovements);
            // $existingData[] = $commonMovements;
            file_put_contents($filePath, json_encode($newData, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success', 'message' => 'Data saved successfully',"data"=>$newData]); 
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    }
?>