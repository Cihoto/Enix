<?php
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        require_once '../session/sessionManager.php';
        $sessionManager = new sessionManager();
        $busBdId = $sessionManager->get('busBdId');
        echo json_encode(["businessId"=> $busBdId]);   
    }else{
        echo json_encode(['error' => 'Método no permitido']);
    }
?>