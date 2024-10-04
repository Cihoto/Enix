<?php
require_once './Bussiness.php';
require_once '../session/sessionManager.php';   
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    require_once './Bussiness.php';
    $business = new Business(null, null, null, null, null);
    $sessionManager = new sessionManager();
    $superAdmin = $sessionManager->get('superAdmin');
    if(!$superAdmin){
        echo json_encode(['error' => 'You are not allowed to perform this action.']);
    }

    $businesses = $business->getAllBusinesses();

    echo json_encode($businesses);
    
}else{
    echo json_encode(['error' => 'Método no permitido']);
}
?>