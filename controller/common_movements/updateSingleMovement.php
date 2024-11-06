<?php 
    require_once $_SERVER['DOCUMENT_ROOT'].'/controller/common_movements/CommonMovements.php';
    require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';

    if($_SERVER["REQUEST_METHOD"] == "PATCH"){

        $req = json_decode(file_get_contents('php://input'), true);
        $data = $req['data'];
        $id = $data['id'];
        $description = $data['desc'];
        $amount = $data['total'];

        $busines = new Business();
        $commonMovements = new movement_common_movement();
        $commonMovements->setBusinessId($busines->getDatabaseBusinessId());
        $commonMovements->setId($id);
        $commonMovements->setDesc($description);
        $commonMovements->setTotal($amount);
        
        $response = $commonMovements->updateSingleMovement();

        if($response['success'] === false){
            echo json_encode(['success' => false,"message"=>$response['message']]);
            exit();
        }

        echo json_encode(['success' => true, 'data' => $response]);

    }else{
        echo json_encode(['success' => false, 'message' => 'Method not allowed',"data" => []]);
    }
?>