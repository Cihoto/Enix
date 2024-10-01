<?php
$json = file_get_contents('php://input');
$data = json_decode($json);

// get POST data
$initDate = $data->initDate;
$busId = $data->bussId;
$bankAcocuntId = $data->bankAcocuntId;


// get first day of the year
$firstDayOfTheYear = date('Y-01-01');
// get first day of the year
// $lastDayOfTheYear = date('Y-01-01');
$lastDayOfTheYear = '2024-12-31';
//get first day fot eh month YYYY-MM-DD
$firstDay = date('Y-m-01');
//get last day for the month YYYY-MM-DD
$lastDay = date('Y-m-t');
//get the current date
$today = date('Y-m-d');

// add one month to current date
$nextMonth = date('Y-m-d', strtotime($today . ' + 1 month'));

$lastMonth = date('Y-m-d', strtotime($today . ' - 1 month'));




// create a get fetch request to https://api.clay.cl/v1/cuentas_bancarias/movimientos/?numero_cuenta=63741369&rut_empresa=77604901&limit=200&offset=0&fecha_desde=2020-01-01
// to get the bank movements of the company
// USING PHP

//get first day if the month YYYY-MM-DD
$firstDayOfTheYear = date('Y-01-01');
// subtract 2 months from $firstDayOfTheYear
$firstDayOfTheYearSub2Months = date('Y-m-d', strtotime($firstDayOfTheYear . ' -2 month'));


//get last day for the month YYYY-MM-DD
$lastDay = date('Y-m-t');
//get the current date
$today = date('Y-m-d');

$response = [];
$offset = 0;
$loopCounter = 0;
$currentItems = 0;
$responseNeedRepeat = true;

$lastOuput = [];

$curl = curl_init();
while ($responseNeedRepeat === true) {
    $loopCounter++;
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.clay.cl/v1/cuentas_bancarias/matches/?orden=Asc&numero_cuenta=$bankAcocuntId&rut_empresa=$busId&limit=200&offset=$offset&fecha_match_desde=2024-07-30",
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
    echo "https://api.clay.cl/v1/cuentas_bancarias/matches/?orden=Asc&numero_cuenta=$bankAcocuntId&rut_empresa=$busId&limit=200&offset=$offset&fecha_match_desde=$initDate";

    // $curl_response = curl_exec($curl);
    // $newItems = json_decode($curl_response, true)['data']['items'];

    // if ($loopCounter == 1) {
    //     $response = json_decode($curl_response, true);
    // } else {
    //     $response['data']['items'] = array_merge($response['data']['items'], $newItems);
    // }

    // $currentItems = count($newItems);
    // $offset = $loopCounter * 200;
    // $responseNeedRepeat = $currentItems == 200;
    // curl_close($curl);



    $curl_response = curl_exec($curl);
    echo $curl_response;
    // echo $curl_response; 
    // $newItems = json_decode($curl_response, true)['data']['items'];
    // echo json_encode($newItems); 

    if ($loopCounter == 1) {
        $response = json_decode($curl_response, true);
    } else {
        $response['data']['items'] = array_merge($response['data']['items'], $newItems);
    }

    $currentItems = count($newItems);
    $offset = $loopCounter * 200;
    $responseNeedRepeat = $currentItems == 200;
    curl_close($curl);
}
// 
// echo json_encode(['lastOutput'=>$lastOuput,'offset'=>$offset,'count' => $currentItems, 'loopCounter' => $loopCounter, 'response' => $response, 'nextMonth' => $nextMonth, 'firstDayOfTheYear' => $firstDayOfTheYear, 'lastDayOfTheYear' => $lastDayOfTheYear, 'today' => $today, 'firstDay' => $firstDay, 'lastDay' => $lastDay,'responseNeedRepeat'=>$responseNeedRepeat]);
echo json_encode($response);

?>