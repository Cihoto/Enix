<?php
    header('Content-Type: application/json');
    if($_SERVER['REQUEST_METHOD'] === 'GET'){
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/BankMovements/BankMovements.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/session/sessionManager.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Bank/BankAccount.php';



        $business = new Business();
        $session = new SessionManager();
        $bankMovements = new BankMovements();
        $bankAccount = new BankAccount();

        

        // $initDate = $_GET['initDate'];
        $initDate = '2024-01-01';
        $accountNumber = $session->get('businessBankAccounts')[0]['account_number'];
        $business_rut = $session->get('businessId');
        $businessBdId = $business->getBdBusinessId($business_rut);
        $bankMovements->setBusinessId($businessBdId);
        $bankMovements->setAccountNumber($accountNumber);

        $bankAccount->setBankAccountNumber($accountNumber);
        $bankAccount->setbankAccountBusinessId($businessBdId);
        $needToUpdate = $bankAccount->getLastInsertion();
        echo json_encode($needToUpdate);
        exit();
        if(!$needToUpdate['success']){
            // echo json_encode([]);
            echo json_encode(["succcess" => true, "message" => "No need to update","error"=> $needToUpdate['message']]);
            exit();
        }

        $bankMovements = $bankMovements->getClayApiMovements($business_rut, date('Y-m-d', strtotime($bankAccount->getLastUpdate())));
        
        if(!$bankMovements['success']){
            echo json_encode(["succcess" => false, "message" => "No se encontraron movimientos bancarios", "error"=> $bankMovements['message']]);
            exit();
        }
        
        if($bankAccount->setLastInsertion()){
            echo json_encode(["success" => true, "message" => "Movimientos bancarios actualizados correctamente"]);
        }else{
            echo json_encode(["success" => false, "message" => "Error al actualizar movimientos bancarios"]);
        }
    }
?>