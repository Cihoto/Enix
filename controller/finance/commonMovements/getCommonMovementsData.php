<?php

require_once $_SERVER['DOCUMENT_ROOT'].'/controller/finance/commonMovements/fileManager.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/session/sessionManager.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/common_movements/CommonMovements.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';

// get post data and get the file name on folder commonMovementsFiles
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $sessionManager = new SessionManager();
    $busines = new Business();
    $businessData = $sessionManager->getAllSessionData();
    $businessName = $businessData['businessName'];
    $businessId = $businessData['businessId'];
    $businessAccount = $sessionManager->get('businessBankAccounts')[0]['account_number'];
    $bdBusinessId = $busines->getBdBusinessId($businessId);
    $fileManager = new FileManager(__DIR__.'/commonMovementsFiles');
    $response = $fileManager->readCommonMovements();

    echo json_encode($response);

    // $conn = new bd();
    // $conn->conectar();
    // $conn->mysqli->begin_transaction();

    // try {
    //     $allMovements = [];
    //     foreach ($response['data'] as $key => $value) {
    //         ['dateFrom' => $dateFrom, 'dateTo' => $dateTo, 'name' => $name, 'income' => $income, 'movements' => $movements] = $value;
            
    //         $amount = $movements[0]['total'];
            
    //         $dateFrom = date('Y-m-d', strtotime($dateFrom));
    //         $dateTo = date('Y-m-d', strtotime($dateTo));
    //         $commonMovements = new CommonMovements(null, $dateFrom, $dateTo, $name, $income, $amount, 1, $bdBusinessId);

    //         $commonMovementResponse = $commonMovements->insertCommonMovement($conn);
            
    //         if ($commonMovementResponse['sucess'] === false) {
    //             throw new Exception($commonMovementResponse['error']);
    //         }

    //         foreach ($movements as $key => $value) {
    //             ['printDate' => $printDate, 'printDateTimestamp' => $printDateTimestamp, 'total' => $total, 'name' => $name, 'desc' => $desc] = $value;
    //             $printDate = date('Y-m-d', strtotime($printDate));
    //             $allMovements[] = [
    //                 'printDate' => $printDate,
    //                 'printDateTimestamp' => $printDateTimestamp,
    //                 'total' => $total,
    //                 'name' => $name,
    //                 'desc' => $desc,
    //                 'common_movement_id' => $commonMovements->getId(),
    //                 'active' => 1
    //             ];
    //         }
    //     }

    //     $movementCommonMovement = new movement_common_movement();
    //     $response = $movementCommonMovement->insertBatchMovementCommonMovement($conn, $allMovements);

    //     if ($response['sucess'] === false) {
    //         throw new Exception('Error inserting movements');
    //     }

    //     $conn->mysqli->commit();
        
    // } catch (Exception $e) {
    //     $conn->mysqli->rollback();
    //     echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    // } finally {
    //     $conn->desconectar();
    //     echo json_encode(['status' => 'success', 'message' => 'Common movements inserted']);
    // }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>