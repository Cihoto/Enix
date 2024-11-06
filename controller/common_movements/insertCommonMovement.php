<?php

require_once $_SERVER['DOCUMENT_ROOT'].'/controller/session/sessionManager.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/common_movements/CommonMovements.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';

// get post data and get the file name on folder commonMovementsFiles
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // data is a json string
    $data = json_decode(file_get_contents('php://input'), true);

    $sessionManager = new SessionManager();
    $busines = new Business();

    $businessData = $sessionManager->getAllSessionData();
    $businessId = $businessData['businessId'];

    $bdBusinessId = $busines->getBdBusinessId($businessId);

    $conn = new bd();
    $conn->conectar();
    $conn->mysqli->begin_transaction();

    try {
        $allMovements = [];
        foreach ($data['data'] as $key => $value) {
            ['dateFrom' => $dateFrom, 'dateTo' => $dateTo, 'name' => $name, 'income' => $income, 'movements' => $movements] = $value;
            
            $amount = $movements[0]['total'];
            
            $dateFrom = date('Y-m-d', strtotime($dateFrom));
            $dateTo = date('Y-m-d', strtotime($dateTo));
            $commonMovements = new CommonMovements(null, $dateFrom, $dateTo, $name, $income, $amount, 1, $bdBusinessId);

            $commonMovementResponse = $commonMovements->insertCommonMovement($conn);
            
            if ($commonMovementResponse['sucess'] === false) {
                throw new Exception($commonMovementResponse['error']);
            }

            foreach ($movements as $key => $value) {
                ['printDate' => $printDate, 'printDateTimestamp' => $printDateTimestamp, 'total' => $total, 'name' => $name, 'desc' => $desc] = $value;
                $printDate = date('Y-m-d', strtotime($printDate));
                $allMovements[] = [
                    'printDate' => $printDate,
                    'printDateTimestamp' => $printDateTimestamp,
                    'total' => $total,
                    'name' => $name,
                    'desc' => $desc,
                    'common_movement_id' => $commonMovements->getId(),
                    'active' => 1
                ];
            }
        }

        $movementCommonMovement = new movement_common_movement();
        $response = $movementCommonMovement->insertBatchMovementCommonMovement($conn, $allMovements);

        if ($response['sucess'] === false) {
            throw new Exception('Error inserting movements');
        }

        $conn->mysqli->commit();
        $conn->desconectar();
        echo json_encode(['status' => 'success', 'message' => 'Common movements inserted']);
    } catch (Exception $e) {
        $conn->mysqli->rollback();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    } 
       
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>