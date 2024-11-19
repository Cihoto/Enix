<?php 


// $json = file_get_contents('php://input');
// $data = json_decode($json);

// // get POST data
// $initDate = $data->initDate;
// $busId = $data->busId;
// $bankAcocuntId = $data->bankAcocuntId;
// $json = file_get_contents('php://input');
// $data = json_decode($json);

// get POST data
$initDate = '2024-01-01';
// $busId = '77604901';
$busId = '76275907';

// $bankAcocuntId = $data->bankAcocuntId;

// $initDate = $data->initDate;
$dateFrom  = date('Y-m-d', strtotime('2024-08-01' . ' -2 month'));
//get first day if the month YYYY-MM-DD
$firstDayOfTheYear = date('Y-01-01');

// get first day of the year
$firstDayOfTheYear = date('Y-01-01');


$firstDayOfTheYearSub2Months = date('Y-m-d', strtotime($firstDayOfTheYear . ' -2 month'));
//get last day for the month YYYY-MM-DD
$lastDay = date('Y-m-t');
//get the current date
$today = date('Y-m-d');


// create a get fetch request to https://api.clay.cl/v1/cuentas_bancarias/movimientos/?numero_cuenta=63741369&rut_empresa=77604901&limit=200&offset=0&fecha_desde=2020-01-01
// to get the bank movements of the company
// USING PHP

$response = [];
$offset = 0;
$loopCounter = 0; 
$currentItems = 0;
$responseNeedRepeat = true;

// echo $firstDayOfTheYearSub2Months;
// echo $dateFrom;
// echo $today;

// $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?guia_despacho=false&rut_empresa=$busId&fecha_desde=2024-01-01&initialize_until=true&limit=200&offset=0";
$url = "https://api.clay.cl/v1/obligaciones/documentos_productos/?rut_empresa=$busId&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=$offset";

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
    $totalRecords = 0;
    $totalLoop = 0;
    if(isset(json_decode($curl_response, true)['data']['records'])){
        // echo "No hay datos";
        $totalRecords = json_decode($curl_response, true)['data']['records']['total_records'];
        $totalLoop = ceil($totalRecords / 200);

        // PUSH CLAY API TO LOCAL RESPONSE 
        $response = json_decode($curl_response, true);
    }else{  
        echo "No hay datos";
        exit();
    }

    for ($i = 1 ; $i < $totalLoop; $i++ ){
        $offset = $i * 200;
        $url = "https://api.clay.cl/v1/obligaciones/documentos_productos/?rut_empresa=$busId&fecha_desde=2024-01-01&initialize_until=true&limit=200&offset=$offset";
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
        // echo json_encode(json_decode($curl_response, true)['data']['items']);

        if(!isset(json_decode($curl_response, true)['data']['items'])){
            // echo "No hay datos";
            break;  
        }
        $newItems = json_decode($curl_response,true)['data']['items'];
        // ['data']['items'];
        $response['data']['items'] = array_merge($response['data']['items'], $newItems);
        curl_close($curl);
    }
    
    echo json_encode($response);    
    // exit();

?>