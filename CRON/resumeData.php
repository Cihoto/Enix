<?php 
    // header('Content-Type: application/json; charset=utf-8');

    $modifiedDocuments = [];

    $conn = new db();
    $conn->conectar();

    // $business_rut = '77604901';
    // $today = date('Y-m-d');

    // $financial_status = getUnpaidDocumentsOnDate($business_rut,'2024-01-01',$today);
    // // echo json_encode($financial_status);
    // $updatedDocuments =  updateDocuments($modifiedDocuments, $financial_status);

    // $issued = array_filter($updatedDocuments, function($item){
    //     return $item['recibida'] == false && $item['pagado'] == false;
    // });

    // $received = array_filter($updatedDocuments, function($item){
    //     return $item['recibida'] == true && $item['pagado'] == false;
    // });

    // // echo json_encode(array_values($issued));

    // // exit();
    
    // $totalIssued = 0;
    // foreach ($issued as $key => $value) {
    //     $totalIssued += $value['saldo_insoluto'] == null? $value['total']['total']  : $value['saldo_insoluto'];
    // }

    // $totalReceived = 0;
    // foreach ($received as $key => $value) {
    //     $totalReceived += $value['saldo_insoluto'] == null? $value['total']['total']  : $value['saldo_insoluto'];
    // }

    // $unpaidBHE = getUnpaidBhe($business_rut,'2024-01-01',8);

    // echo $totalIssued + 2012023;
    // echo "<br>";
    // echo $totalReceived + $unpaidBHE['unpaidBHE'];

    // exit();




    // echo json_encode(['success'=>true,'message' => 'Conexión exitosa']);
    // try{

        $sql = "SELECT b.id, b.rut,dv, bk.account_number FROM business b 
        INNER JOIN bank_account bk ON bk.business_id = b.id;";

        $result = $conn->mysqli->query($sql);

        // foreach ($result as $key => $value) {
        //     echo json_encode($value);
        //     echo "<br>";
        // }

        // print_r($result);
        // echo "<br>";

        // iterate over all business
        foreach ($result as $key => $business) {
            $modifiedDocuments = [];
            print_r($business); 
            echo "<br>";

            $business_rut = $business['rut'];
            $business_dv = $business['dv'];
            $business_id = $business['id'];
            $account_number = $business['account_number'];

            // get all modified documents
            $sql = "SELECT * FROM `modified_tributarie_documents` WHERE business_id = ?";
            $stmt = $conn->mysqli->prepare($sql);
            // $business_id = 1;
            $stmt->bind_param("i", $business_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $modifiedDocuments = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();



            $today = date('Y-m-d', strtotime('-1 day'));

            $unpaidBHE = getUnpaidBhe($business_rut,'2024-01-01',$business_dv);
            $financial_status = getUnpaidDocumentsOnDate($business_rut,'2024-01-01',$today);
            // echo json_encode($financial_status);
            $updatedDocuments =  updateDocuments($modifiedDocuments, $financial_status);
            // $updatedDocuments =  updateDocuments($modifiedDocuments, $financial_status);
            // $totals  = addIssuedAndReceived($updatedDocuments);


            $issued = array_filter($updatedDocuments, function($item){
                return $item['recibida'] == false && $item['pagado'] == false;
            });
            $received = array_filter($updatedDocuments, function($item){
                return $item['recibida'] == true && $item['pagado'] == false;
            });
            
            $totalIssued = 0;
            foreach ($issued as $key => $value) {
                $totalIssued += $value['saldo_insoluto'] == null? $value['total']['total']  : $value['saldo_insoluto'];
            }
        
            $totalReceived = 0;
            foreach ($received as $key => $value) {
                $totalReceived += $value['saldo_insoluto'] == null? $value['total']['total']  : $value['saldo_insoluto'];
            }
        
            $unpaidBHE = getUnpaidBhe($business_rut,'2024-01-01',8);
            $bankBalance = getBankBalance($account_number, $business_rut, $today,$today);
        
            echo $totalIssued;
            echo "<br>";
            echo $totalReceived + $unpaidBHE['unpaidBHE'];

            echo "<br>";
            $newtotal = ($totalIssued + $bankBalance) - ($totalReceived + $unpaidBHE['unpaidBHE']);
            echo $newtotal;
            echo "<br>";
            echo "<br>";
            $totals = [
                'issued' => $totalIssued,
                'received' => $totalReceived + $unpaidBHE['unpaidBHE'],
                'bankBalance' => $bankBalance,
                'total' => $totalIssued - $totalReceived,
                'date' => $today,
                'avit' => $bankBalance + $totalIssued - $totalReceived - $unpaidBHE['unpaidBHE']
            ];

            echo json_encode($totals);
            echo "<br>";

            
            
            // save all data in database
            // in table financial_status
            // prepare and bind query


            $query = "INSERT INTO `financial_status`(`issued`, `received`, `total`, `date`, `bank_balance`, `avit`, `business_id`) VALUES (?,?,?,?,?,?,?)";
            $stmt = $conn->mysqli->prepare($query);
            $stmt->bind_param("iiisiii", $totals['issued'], $totals['received'], $totals['total'], $totals['date'], $totals['bankBalance'], $totals['avit'], $business_id);
            $stmt->execute();
            $stmt->close();

        }

        $conn->desconectar();

    // }catch(Exception $e){
    //     echo json_encode(['success'=>false,'message' => $e->getMessage()]);
    //     $conn->desconectar();
    //     exit();
    // }
    // echo json_encode($totals);
    exit();

    function getUnpaidDocumentsOnDate($business_rut,$dateFrom,$dateTo){
       
        $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?pagada=false&guia_despacho=false&rut_empresa=$business_rut&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=0";
    
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

        if (isset(json_decode($curl_response, true)['data']['records'])) {
            // echo "No hay datos";
            $totalRecords = json_decode($curl_response, true)['data']['records']['total_records'];
            $totalLoop = ceil($totalRecords / 200);
            // PUSH CLAY API TO LOCAL RESPONSE 
            $response = json_decode($curl_response, true);
        } else {
            return ["success" => false, "message" => "No data found"];
            exit();
        }
        for ($i = 1; $i < $totalLoop; $i++) {
            $offset = $i * 200;
            $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?pagada=false&guia_despacho=false&rut_empresa=$business_rut&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=$offset";

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
            if (!isset(json_decode($curl_response, true)['data']['items'])) {
                // echo "No hay datos";
                break;
            }
            $newItems = json_decode($curl_response, true)['data']['items'];
            // ['data']['items'];
            $response['data']['items'] = array_merge($response['data']['items'], $newItems);
            curl_close($curl);
        }

        return $response['data']['items'];
    }

    function getUnpaidBhe($business_rut,$dateFrom,$dv){
        
    
        // $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?guia_despacho=false&rut_empresa=$business_rut&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=0";
        // $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?guia_despacho=false&rut_empresa=77604901    &fecha_desde=2024-01-01&initialize_until=true&limit=200&offset=0";
        $url = "https://api.clay.cl/v1/obligaciones/boletas_honorarios/?rut_receptor=$business_rut&dv_receptor=$dv&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=0";
    
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

        if (isset(json_decode($curl_response, true)['data']['records'])) {
            // echo "No hay datos";
            $totalRecords = json_decode($curl_response, true)['data']['records']['total_records'];
            $totalLoop = ceil($totalRecords / 200);
            // PUSH CLAY API TO LOCAL RESPONSE 
            $response = json_decode($curl_response, true);
        } else {
            return ["success" => false, "message" => "No data found"];
            exit();
        }
        for ($i = 1; $i < $totalLoop; $i++) {
            $offset = $i * 200;
            // $url = "https://api.clay.cl/v1/obligaciones/boletas_honorarios/?rut_receptor=$business_rut&dv_receptor=$dv&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=$offset";
            // $url = "https://api.clay.cl/v1/obligaciones/documentos_tributarios/?pagada=false&guia_despacho=false&rut_empresa=$business_rut&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=$offset";
            $url = "https://api.clay.cl/v1/obligaciones/boletas_honorarios/?rut_receptor=$business_rut&dv_receptor=$dv&fecha_desde=$dateFrom&initialize_until=true&limit=200&offset=$offset";

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
            if (!isset(json_decode($curl_response, true)['data']['items'])) {
                // echo "No hay datos";
                break;
            }
            $newItems = json_decode($curl_response, true)['data']['items'];
            // ['data']['items'];
            $response['data']['items'] = array_merge($response['data']['items'], $newItems);
            curl_close($curl);
        }   

        // return $response['data']['items'];
        $unpaid = array_filter($response['data']['items'], function($item){
            return $item['pagada'] == false && isset($item['status']) && strtolower($item['status']) != "nula";
        });

        $totalUnpaid = 0;
        foreach ($unpaid as $key => $value) {
            $totalUnpaid += $value['total']['total_honorario'];
        }

        return ["unpaidBHE" => $totalUnpaid];
    }


    function addIssuedAndReceived($data){


        $issued = array_filter($data, function($item){
            return $item['recibida'] == false && $item['pagado'] == false;
        });

        $received = array_filter($data, function($item){
            return $item['recibida'] == true && $item['pagado'] == false;
        });
        
        $totalIssued = 0;
        foreach ($issued as $key => $value) {
            $totalIssued += $value['saldo_insoluto'] == null? $value['total']['total']  : $value['saldo_insoluto'];
        }
    
        $totalReceived = 0;
        $counterRecibida = 0;
        foreach ($received as $key => $value) {
            $counterRecibida++;
            $totalReceived += $value['saldo_insoluto'] == null? $value['total']['total']  : $value['saldo_insoluto'];
        }
        echo "Total Received: ",$totalReceived," | Total Issued: ",$totalIssued," | Counter Received: ",$counterRecibida;
        echo "<br>";
        echo "Total Received: ",count($received)," | Total Issued: ",count($issued);
        $yesterday = date('Y-m-d',strtotime("-1 days"));
        return [
            'issued' => $totalIssued,
            'received' => $totalReceived,
            'total' => $totalIssued - $totalReceived,
            'date' => $yesterday
        ];
    }

    function getBankBalance($account_number, $business_rut, $dateFrom,$dateTo){

        $url = "https://api.clay.cl/v1/cuentas_bancarias/saldos/?numero_cuenta=$account_number&rut_empresa=$business_rut&limit=200&offset=0&fecha_desde=$dateFrom&fecha_hasta=$dateTo&initialize_until=true";
        
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
    }


    function updateDocuments($modifiedDocuments, $allMyDocuments) {

        $allMyDocuments = array_filter($allMyDocuments, function($document){

            $rejected = false;
            if($document['recepcion'] != null){
                $rejected = $document['recepcion']['estado'] == 'R';
            }
           
            return $document['codigo'] != 61 
            && $document['codigo'] != 43 
            && !$rejected;
        });

        foreach ($modifiedDocuments as $modDoc) {
            foreach ($allMyDocuments as $document) {

                $rut = "";

                if($document['recibida']){
                    $rut = $document['emisor']['rut']."-".$document['emisor']['dv'];
                }else{
                    $rut = $document['receptor']['rut']."-".$document['receptor']['dv'];
                }
                $documentTotal = $document['total']['total'];
                if ($document['numero'] == $modDoc['folio'] 
                    && $rut == $modDoc['rut'] 
                    && $documentTotal == $modDoc['total'] 
                ) {
                    // echo "Document found: recibido-> ",$document['recibida'] == 1? "true": "false", "    | Folio: ",$document['numero'],"          |Rut: ",$rut,"     |Total: ",$documentTotal;
                    // echo "| Balance: ",$modDoc['balance']," | Is Paid: ",$modDoc['is_paid'] == 1? "true": "false";
                    // echo "<br>";
                    $documentBalance = $document['saldo_insoluto'] == null ? $document['total']['total'] : $document['saldo_insoluto'];
                    

                    if($document['pagado'] == 1 || $document['pagado']){

                    }else{
                        $document['pagado'] = $modDoc['is_paid'] == 1 ? true : false;
                    }

                    if ($documentBalance > $modDoc['balance']) {
                        $document['saldo_insoluto'] = $modDoc['balance'];
                    }

                    // Update the document in the allMyDocuments array
                    foreach ($allMyDocuments as &$doc) {

                        $rut_verified = "";

                        if($doc['recibida']){
                            $rut_verified = $doc['emisor']['rut']."-".$doc['emisor']['dv'];
                        }else{
                            $rut_verified = $doc['receptor']['rut']."-".$doc['receptor']['dv'];
                        }

                        if ($doc['numero'] == $document['numero'] && $rut_verified == $rut && $doc['total']['total'] == $document['total']['total']) {
                            $doc = $document;
                            break;
                        }
                    }
                }
            }
        }

        // echo "<br>";
        // echo count($allMyDocuments);
        // echo "<br>";

        return $allMyDocuments;
    }


    class db{
        protected $servidor;
        protected $usuario;
        protected $password;
        protected $database;
        protected $port;
        public $mysqli;

        public function __construct() {
            $this->servidor = 'srv994.hstgr.io';
            $this->usuario = 'u136839350_EnixAdm';
            $this->password = 'Enix2024.';
            // $this->password = 'Intec2023.';
            $this->database = 'u136839350_EnixProd';
            $this->port ='3306';
        }
    
        public function conectar() {
            $this->mysqli = new mysqli($this->servidor, $this->usuario, $this->password, $this->database, $this->port);
            if (mysqli_connect_errno()) {
                echo 'Error en base de datos: '. mysqli_connect_error();
                exit();
            }
            $this->mysqli->set_charset("utf8");
            $this->mysqli->query("SET NAMES 'utf8'");
            $this->mysqli->query("SET CHARACTER SET utf8");
        }
    
        public function desconectar() {
            mysqli_close($this->mysqli);
        }
    }
?>