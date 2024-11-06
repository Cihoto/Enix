<?php
    require_once $_SERVER['DOCUMENT_ROOT'].'/controller/common_movements/CommonMovements.php';
    require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';

    if($_SERVER["REQUEST_METHOD"] == "GET"){

        $busines = new Business();
        $commonMovements = new CommonMovements();

        $commonMovements->setBusinessId($busines->getDatabaseBusinessId());
        $response = $commonMovements->getCommonMovements();

        echo json_encode(['success' => true, 'data' => $response]);
    }else{
        echo json_encode(['success' => false, 'message' => 'Method not allowed',"data" => []]); 
    }
?>