<?php


    if($_SERVER['REQUEST_METHOD'] === "PATCH"){
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/common_movements/CommonMovements.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';

        // get patch id
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['commonMovementId'];

        $busines = new Business();
        $commonMovements = new CommonMovements();
        $commonMovements->setBusinessId($busines->getDatabaseBusinessId());
        $commonMovements->setId($id);
        $response = $commonMovements->softDeleteCommonMovement();

        if($response['success'] === false){
            echo json_encode(['success' => false,"message"=>$response['message']]);
            exit();
        }

        echo json_encode(['success' => true, 'data' => $response]);

    }else{
        echo json_encode(['success' => false, 'message' => 'Method not allowed',"data" => []]);
    }

?>