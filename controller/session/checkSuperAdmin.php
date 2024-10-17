<?php
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        require_once './sessionManager.php';

        $session = new SessionManager();
        if($session->get('superAdmin') == 1){
            echo json_encode(array('status' => 'success', 'superAdmin' => true));
        }else{
            echo json_encode(array('status' => 'failed', 'superAdmin' => false));
        }
    }
?>