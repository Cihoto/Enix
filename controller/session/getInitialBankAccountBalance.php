<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    require_once '../session/sessionManager.php';
    $sessionManager = new sessionManager();

    $dateTo = date('Y-12-31', strtotime('-1 year'));
    
    // echo $sessionManager->get('businessBankAccounts');
    // echo $sessionManager->get('businessBankAccounts');
    $bankAccountNumber = $sessionManager->get('businessBankAccounts')[0]['account_number'];
    // $bankAccountNumber = $bankAccount[0]['bankAccountNumber'];
    $business_rut = $sessionManager->get('businessId');
    $business_rut = $sessionManager->get('businessId');

    $bankBalance = getBankBalance($bankAccountNumber, $business_rut, $dateTo, $dateTo);

    if($bankBalance == 0){
        $localBalance = $bankAccountNumber = $sessionManager->get('businessBankAccounts')[0]['initial_balance'];
        echo json_encode(["balance" => $localBalance]);
        exit();
    }

    echo json_encode(["balance" => $bankBalance]);


    // echo json_encode(["bankAccount" => $bankAccount[0]]);
}


function getBankBalance($bankAccountNumber, $business_rut, $dateFrom, $dateTo)
{

    try {
        $url = "https://api.clay.cl/v1/cuentas_bancarias/saldos/?numero_cuenta=$bankAccountNumber&rut_empresa=$business_rut&limit=200&offset=0&fecha_desde=$dateFrom&fecha_hasta=$dateTo&initialize_until=true";

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'accept: application/json',
                'Token: 9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
            ),
        ));

        $curl_response = curl_exec($curl);
        $response = json_decode($curl_response, true);
        $balance = $response['data']['items'][0]['saldo_disponible'];
        // $balance = $response['data']['items'];

        return $balance;
    } catch (Exception $e) {
        return 0;
    }
}
