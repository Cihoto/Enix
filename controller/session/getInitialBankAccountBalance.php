<?php
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        require_once '../session/sessionManager.php';
        $sessionManager = new sessionManager();
        
        $bankAccount = $sessionManager->get('businessBankAccounts');

        echo json_encode(["bankAccount"=> $bankAccount[0]]);
    }
?>