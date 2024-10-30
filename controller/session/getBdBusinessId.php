<?php 
    if("POST" == $_SERVER['REQUEST_METHOD']){
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/session/sessionManager.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';
        
        $sessionManager = new SessionManager();
        $business = new Business();

        $data = json_decode(file_get_contents('php://input'), true);
        $business_rut = $sessionManager->get('businessId');
        $business_id = $sessionManager->get('businessId');
        $business_db_id = $business->getBdBusinessId($business_id);

        if(!$business_db_id){
            echo json_encode(['success'=>false, 'error' => 'Error getting business id']);
            exit();
        }
        
        echo json_encode(['success'=>true, 'business_db_id' => $business_db_id]);
    }
?>