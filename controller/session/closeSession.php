<?php
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        require_once '../session/sessionManager.php';
        $sessionManager = new sessionManager();
        $sessionManager->closeSession();
        echo json_encode(["success"=>true,"message"=>"Sesión cerrada correctamente"]);   
    }else{
        echo json_encode(["success"=>false,'error' => 'Método no permitido']);
    }
?>