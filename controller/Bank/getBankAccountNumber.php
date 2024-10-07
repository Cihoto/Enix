<?php
    if($_SERVER['REQUEST_METHOD'] == "POST"){
        require_once '../session/sessionManager.php';
        $session = new sessionManager();
        $bankAccounts = $session->get('businessBankAccounts');
        echo json_decode($bankAccounts[0]['account_number']);
    }
?>