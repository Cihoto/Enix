<?php
// get first day of the year
$firstDayOfTheYear = date('Y-01-01');

//get first day fot eh month YYYY-MM-DD
$firstDay = date('Y-m-01');
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


while ($responseNeedRepeat) {
    $curl = curl_init();
    $loopCounter++;

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.clay.cl/v1/cuentas_bancarias/saldos/?numero_cuenta=63741369&rut_empresa=77604901&limit=200&offset=$offset&fecha_desde=$firstDayOfTheYear",
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
    $newItems = json_decode($curl_response, true)['data']['items'];

    if ($loopCounter == 1) {
        $response = json_decode($curl_response, true);
    } else {
        $response['data']['items'] = array_merge($response['data']['items'], $newItems);
    }


    $currentItems = count($newItems);
    $responseNeedRepeat = $currentItems == 200;
    $offset = $loopCounter * 200;
    curl_close($curl);
}
// 
// echo json_encode(['asdasd'=>$loopCounter]);
echo json_encode($response);

?>